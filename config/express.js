const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path')
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(bodyParser.json());

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());


    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);

    require('../src/app/Lecture/lectureRoute')(app);

<<<<<<< HEAD
    require('../src/app/Community/communityRoute')(app);
=======

    require('../src/app/Video/videoRoute')(app);
>>>>>>> 3ab0ecb747c28f410cb17052b94b0e2d821a731f

    require('../src/indexRoute')(app);

    return app;
};