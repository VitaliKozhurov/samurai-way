import express, { Express, Request, Response } from 'express';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from './types';
import { CreateCourseModel } from './models/CreateCourseModel';
import { UpdateCourseModel } from './models/UpdateCourseModel';
import { QueryCoursesModel } from './models/QueryCoursesModel';
import { CourseViewModel } from './models/CourseViewModel';
import { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel';

type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

const jsonMiddleware = express.json();
const port = 5000;

export const app: Express = express();

app.use(jsonMiddleware);

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const db: { courses: CourseType[] } = {
  courses: [
    {
      id: 1,
      title: 'front-end',
      studentsCount: 10,
    },
    {
      id: 2,
      title: 'back-end',
      studentsCount: 10,
    },
    {
      id: 3,
      title: 'qa',
      studentsCount: 10,
    },
    {
      id: 4,
      title: 'devops',
      studentsCount: 10,
    },
  ],
};

const mapDbCourseToCourseViewModel = (course: CourseType): CourseViewModel => ({
  id: course.id,
  title: course.title,
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get(
  '/courses',
  (
    req: RequestWithQuery<QueryCoursesModel>,
    res: Response<CourseViewModel[]>
  ) => {
    const filterTitle = req.query.title;

    if (!filterTitle) {
      return res.json(db.courses.map((c) => ({ id: c.id, title: c.title })));
    }

    const filteredCourses = db.courses.filter((c) =>
      c.title.includes(filterTitle)
    );

    res.json(filteredCourses.map((c) => mapDbCourseToCourseViewModel(c)));
  }
);

app.get(
  '/courses/:id',
  (
    req: RequestWithParams<URIParamsCourseIdModel>,
    res: Response<CourseViewModel>
  ) => {
    const id = req.params.id;
    const foundedCourse = db.courses.find((c) => c.id === +id);

    if (foundedCourse) {
      res.json({ id: foundedCourse.id, title: foundedCourse.title });
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  }
);

app.post(
  '/courses',
  (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
    const title = req.body.title;

    if (!title) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }

    const course: CourseType = {
      id: db.courses.length + 1,
      title,
      studentsCount: 0,
    };

    db.courses.push(course);

    res
      .status(HTTP_STATUSES.CREATED_201)
      .json(mapDbCourseToCourseViewModel(course));
  }
);

app.delete(
  '/courses/:id',
  (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    } else {
      const isCourseExist = db.courses.find((c) => c.id === +id);

      if (!isCourseExist) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }

      const updatedCourses = db.courses.filter((c) => c.id !== +id);
      db.courses = updatedCourses;
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
  }
);

app.put(
  '/courses/:id',
  (
    req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
    res: Response
  ) => {
    const id = req.params.id;

    const title = req.body.title;

    if (!title) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }

    const course = db.courses.find((c) => c.id === +id);

    if (course) {
      course.title = title;

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  }
);

app.delete('/tests/data', (req: Request, res: Response) => {
  db.courses = [];

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
