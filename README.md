# Set Up Guide

## Required Tech 
- npm 
- Docker 

## Instructions 
1. From the command line, move into the folder you would like the git repository to reside in.
2. Clone the git repository.
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
9. Run the following command. Note that the -d option prevents you from being bombarded with logs when creating the containers:
```bash
docker compose up -d
```

10.  Once the containers are set up you should see something like this in the terminal. It will take around 30s for the Database to set up so please wait until you see this screen. 
```bash
$ docker compose up -d
[+] Running 4/4
 ✔ Network seng513-202401-group-15_default       Created                   0.2s 
 ✔ Container db                                  Healthy                  12.5s 
 ✔ Container seng513-202401-group-15-backend-1   Started                  13.0s 
 ✔ Container seng513-202401-group-15-frontend-1  Started                  13.8s
```

11. Navigate to the following link in your browser to access the frontend: 
```bash
http://localhost:3000/
```
The backend runs on port 8080, here is a sample curl command you can run: 
```bash
curl localhost:8080
```
     
   To access the database (mysql) from the command line you can run this command, it will prompt you to enter the password from your .env file: 
```bash
 docker exec -it db mysql -u root -p
```
## Login Access/Seeding

- The database will have seeded data by default for viewing puposes.
- To login as a user, use any of the following emails:
   - mike.wazowski@ucalgary.ca
   - chicken.little@ucalgary.ca
   - buzz.lightyear@ucalgary.ca
   - mary.poppins@ucalgary.ca

- To login as an administrator, use any of the following emails:
   - daffy.duck@ucalgary.ca
   - pink.panther@ucalgary.ca

- The default passowrd for all seeded users is: "A!123456".

- Or, feel free to make your own account if you have access to a ucalgary email.