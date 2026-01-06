import request from "supertest";
import { app, HTTP_STATUSES } from "./../../../src/index";

describe("/course", () => {
  beforeAll(async () => {
    await request(app).delete("/tests/data");
  });

  it("should return status code 200 and empty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("should return status code 404 for not existing course", async () => {
    await request(app).get("/courses/1").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not create course with incorrect input data", async () => {
    await request(app)
      .post("/courses")
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  let createdCourse: any;

  it("should create course with correct input data", async () => {
    const response = await request(app)
      .post("/courses")
      .send({ title: "New Course" })
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse = response.body;

    expect(createdCourse).toEqual({
      id: expect.any(Number),
      title: "New Course",
    });

    await request(app)
      .get("/courses")
      .expect(HTTP_STATUSES.OK_200, [createdCourse]);
  });

  it("should not update course with incorrect input data", async () => {
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse);
  });

  it("should not update course if course not exist", async () => {
    await request(app)
      .put(`/courses/1000`)
      .send({ title: "new title" })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should update course with correct input data", async () => {
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send({ title: "Updated title" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdCourse,
        title: "Updated title",
      });
  });

  it("should not delete course if course not exist", async () => {
    await request(app)
      .delete(`/courses/1000`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should send 400 status without course id request", async () => {
    await request(app).delete(`/courses`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should delete course with correct course id", async () => {
    await request(app)
      .delete(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });
});
