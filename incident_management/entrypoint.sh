#!/bin/sh
./wait-for-it.sh mysql:3306
sleep 10

# Exécuter les migrations
python manage.py migrate

# Créer le superutilisateur si aucun n'existe
#echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'password')" | python manage.py shell

# Lancer le serveur Django
python manage.py runserver 0.0.0.0:8000
