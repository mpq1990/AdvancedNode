const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("when logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("and using valid inputs", () => {
    beforeEach(async () => {
      await page.type(".title input", "Titile y'all");
      await page.type(".content input", "Content y'all");
      await page.click("form button");
    });

    test("submiting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("submitting and saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("Titile y'all");
      expect(content).toEqual("Content y'all");
    });
  });

  describe("and using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("when user is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "My Title",
        content: "My Content",
      },
    },
  ];
  test("blog related actions are prohibited", async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });

  //   test("user cannot create blog post", async () => {
  //     const result = await page.post("/api/blogs", {
  //       title: "My Title",
  //       content: "My Content",
  //     });
  //     expect(result).toEqual({ error: "You must log in!" });
  //   });

  //   test("user cannot get a list of posts", async () => {
  //     const result = await page.get("/api/blogs");

  //     expect(result).toEqual({ error: "You must log in!" });
  //   });
});