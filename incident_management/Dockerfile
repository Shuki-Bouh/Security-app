# Utilisez une image Python comme base
FROM python:3.10-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier requirements pour installer les dépendances
COPY requirements.txt /app/

# Installez les dépendances
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiez le reste des fichiers de votre application
COPY . /app/

RUN chmod a+x wait-for-it.sh && \
    chmod a+x entrypoint.sh

# Exposez le port que Django utilise
EXPOSE 8000

