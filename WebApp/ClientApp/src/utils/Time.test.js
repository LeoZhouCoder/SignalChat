import { getTimeString } from "./Time";

test("Date 2020-02-26T23:04:29.831Z", () => {
  expect(getTimeString("2020-02-26T23:04:29.831Z")).toBe("2020-02-27");
});

