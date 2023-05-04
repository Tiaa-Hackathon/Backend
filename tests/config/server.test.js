const dotenv = require("dotenv");

dotenv.config();

describe("Checks is server runs properly", () => {
  it("should test enviroment to be test", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it("should test server port to be defined", () => {
    expect(process.env.PORT).toBeDefined();
  });

  it("should test jwt secret key to be defined", () => {
    expect(process.env.JWT_SECRET).toBeDefined();
  });
});
