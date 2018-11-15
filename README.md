# Krav Maga

This is a single page application written in React and Flux (Alt.js). It uses plain React Bootstrap FE framework (based on Bootstrap 3). The application runs Node.js (Express) on the server and uses MongoDB as the database. Gulp is used for task automation.

The purpose of this application is letting a martial arts (Krav Maga) instructor to manage lessons, payments, students and groups. And for students to sign up for lessons and see their payments.

## Links
1. Production version can be found on http://drosadistance.lv
2. A staging version can be found on http://krav-maga-s.herokuapp.com. Admin panel can be access with the following credentials: admin@kravmaga.lv (username) and admin (password).

## Installation
1. Download the repository
2. Install npm and bower modules: `npm install` (make sure the specified MongoDB instance is running for the admin user script that created the default user)

## Running the app
1. Locally run the `start.sh` script or run `node server/server.js` and pre-pending `JWT_SECRET` and `DB_URI` environmental variables.
2. View in browser at http://localhost:3000

If you have any questions, please contact Martins at [mkozlovskis@gmail.com](mkozlovskis@gmail.com).
