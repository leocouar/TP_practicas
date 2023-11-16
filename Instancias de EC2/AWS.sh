#!/bin/bash

# Variables de configuración
AMI_ID="ami-xxxxxxxxxxxxx"  # Reemplaza con el ID de la imagen de Amazon Machine (AMI) de Node.js
INSTANCE_TYPE="t2.micro"    # Tipo de instancia
KEY_NAME="YourKeyPair"      # Nombre de tu par de claves
SECURITY_GROUP_NAME="MySecurityGroup"  # Nombre del grupo de seguridad
SECURITY_GROUP_DESCRIPTION="Security group for EC2 instance"
PUBLIC_IP="0.0.0.0/0"  # Dirección IP pública para acceso (0.0.0.0/0 permite acceso desde cualquier lugar)

# Lanzar una instancia EC2
instance_id=$(aws ec2 run-instances \
  --image-id $AMI_ID \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-groups $SECURITY_GROUP_NAME \
  --user-data "#!/bin/bash
              yum update -y
              yum install -y nodejs npm" \
  --output json | jq -r '.Instances[0].InstanceId')

# Esperar a que la instancia esté en estado 'running'
aws ec2 wait instance-running --instance-ids $instance_id


# Aplicacion de autoscaling (Escalar hacia arriba cuando la CPU esté por encima del 80% durante 5 minutos.)
aws autoscaling put-scaling-policy \
  --policy-name ScaleUpPolicy \
  --auto-scaling-group-name MyAutoScalingGroup \
  --scaling-adjustment 1 \
  --adjustment-type ChangeInCapacity \
  --cooldown 300

# Aplicacion de autoscaling (Escalar hacia abajo cuando la CPU esté por debajo del 30% durante 10 minutos.)
aws autoscaling put-scaling-policy \
  --policy-name ScaleDownPolicy \
  --auto-scaling-group-name MyAutoScalingGroup \
  --scaling-adjustment -1 \
  --adjustment-type ChangeInCapacity \
  --cooldown 600

# Configurar Elastic Load Balancer (ELB)
aws elbv2 create-load-balancer \
  --name MyLoadBalancer \
  --subnets subnet-12345678 subnet-87654321


# Crear un grupo de seguridad
security_group_id=$(aws ec2 create-security-group \
  --group-name $SECURITY_GROUP_NAME \
  --description "$SECURITY_GROUP_DESCRIPTION" \
  --output json | jq -r '.GroupId')

# Agregar regla de seguridad para el puerto 80 (HTTP)
aws ec2 authorize-security-group-ingress \
  --group-id $security_group_id \
  --protocol tcp \
  --port 80 \
  --cidr $PUBLIC_IP

# Regla para permitir el tráfico SSH (puerto 22) desde una dirección IP específica:
aws ec2 authorize-security-group-ingress \
  --group-id $security_group_id \
  --protocol tcp \
  --port 22 \
  --cidr 192.168.1.1/32


# Asociar el grupo de seguridad con la instancia
aws ec2 modify-instance-attribute \
  --instance-id $instance_id \
  --groups $security_group_id

# Obtener la dirección IP pública de la instancia
public_ip=$(aws ec2 describe-instances --instance-ids $instance_id --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "Instancia EC2 lanzada con ID: $instance_id y dirección IP pública: $public_ip"
