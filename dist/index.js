"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonMiddleware = express_1.default.json();
const port = 5000;
const app = (0, express_1.default)();
app.use(jsonMiddleware);
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const db = {
    courses: [
        {
            id: 1,
            title: 'front-end',
        },
        {
            id: 2,
            title: 'back-end',
        },
        {
            id: 3,
            title: 'qa',
        },
        {
            id: 4,
            title: 'devops',
        },
    ],
};
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/courses', (req, res) => {
    const filterTitle = req.query.title;
    if (!filterTitle) {
        return res.json(db.courses);
    }
    const filteredCourses = db.courses.filter((c) => c.title.includes(filterTitle));
    res.json(filteredCourses);
});
app.get('/courses/:id', (req, res) => {
    const id = req.params.id;
    const createdCourse = id ? db.courses.find((c) => c.id === +id) : id;
    if (createdCourse) {
        res.json(createdCourse);
    }
    else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});
app.post('/courses', (req, res) => {
    const title = req.body.title;
    if (!title) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }
    const course = { id: db.courses.length + 1, title };
    db.courses.push(course);
    res.status(HTTP_STATUSES.CREATED_201).json(course);
});
app.delete('/courses/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    else {
        const updatedCourses = db.courses.filter((c) => c.id !== +id);
        db.courses = updatedCourses;
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
});
app.put('/courses/:id', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    if (!title) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }
    if (id) {
        db.courses = db.courses.map((c) => (c.id === +id ? { ...c, title } : c));
        res.json(HTTP_STATUSES.NO_CONTENT_204);
    }
    else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
