# Set Up Guide

## Required Tech 
- npm 
- Docker 

## Instructions 
1. Frome the command line, move into the folder you would like the git repository to reside in
2. Clone the git respositiory.
```bash
git clone git@csgit.ucalgary.ca:enioluwafe.balogun/seng513-202401-group-15.git
```
3. Move into to the folder: seng513-202401-group-15
4. Make a file called '.env' inside the current directory (seng513-202401-group-15). 
5. Copy the contents of the .env.sample file into your .env, and change the password as needed.
6. Move into the "backend" folder and run: 
```bash
npm install
```
7.  Move into the "frontend" folder and run: 
```bash
npm install
```
8. Move back into the root folder (seng513-202401-group-15)
9. Run the following command. The -d option prevents you from being bombarded with logs: 
```bash
sudo docker compose up -d
```
10. Navigate to the following link in your browser to access the frontend: 
```bash
http://localhost:3000/
```
The backend runs on port 8080, here is a sample curl command you can run: 
```bash
curl localhost:8080
```
     
   To access the database (mysql) from the command line you can run this command, it will prompt you to enter the password from your .env file: 
```bash
sudo docker exec -it db mysql -u root -p
```

## Password Strategy 
We only have one password we need to worry about: the mysql root password. We place our msql password in a .env file, and use the docker compose env_file, and environment keys to share that password with the mysql container. This allows all team members to create their own custom password by editing the file. Finally, to prevent leaked passwords .env is included in the ".gitignore" file. 



