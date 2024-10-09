const { Builder, By } = require("selenium-webdriver");
const { describe, it, after, before } = require("mocha");
const assert = require("assert");

let driver;

describe("Color Generator Tests", function () {
  this.timeout(30000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    let url = "http://127.0.0.1:5500/selection_code/index.html";
    await driver.get(url); 
  });

  after(async () => {
    await driver.quit();
  });

  it("should display the color box", async () => {
    const colorBox = await driver.findElement(By.id("colorDisplay"));
    const isDisplayed = await colorBox.isDisplayed();
    assert.strictEqual(isDisplayed, true);
  });

  it("should display the Generate Color button", async () => {
    const button = await driver.findElement(By.tagName("button"));
    const isDisplayed = await button.isDisplayed();
    assert.strictEqual(isDisplayed, true);
  });

  it("should display the hex code", async () => {
    const hexCode = await driver.findElement(By.id("hexCode"));
    const isDisplayed = await hexCode.isDisplayed();
    assert.strictEqual(isDisplayed, true);
  });

  it("should change the hex code when the button is clicked", async () => {
    const initialHexCode = await driver.findElement(By.id("hexCode")).getText();
    await driver.findElement(By.tagName("button")).click();
    const newHexCode = await driver.findElement(By.id("hexCode")).getText();
    assert.notStrictEqual(newHexCode, initialHexCode);
  });

  it("should change the background color of the color display box when the button is clicked", async () => {
    const initialBgColor = await driver
      .findElement(By.id("colorDisplay"))
      .getCssValue("background-color");
    await driver.findElement(By.tagName("button")).click();
    const newBgColor = await driver
      .findElement(By.id("colorDisplay"))
      .getCssValue("background-color");
    assert.notStrictEqual(newBgColor, initialBgColor);
  });

  it("should generate a valid hex color code", async () => {
    await driver.findElement(By.tagName("button")).click();
    const hexCode = await driver.findElement(By.id("hexCode")).getText();
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    assert.strictEqual(hexPattern.test(hexCode), true);
  });

  it("should match the background color to the generated hex code", async () => {
    await driver.findElement(By.tagName("button")).click();
    const hexCode = await driver.findElement(By.id("hexCode")).getText();
    const bgColor = await driver
      .findElement(By.id("colorDisplay"))
      .getCssValue("background-color");
    const rgbValues = bgColor.match(/\d+/g).map(Number);
    const rgbToHex = `#${rgbValues
      .map((val) => val.toString(16).padStart(2, "0"))
      .join("")}`.substring(0, 7);

    assert.strictEqual(rgbToHex, hexCode, rgbToHex);
  });

  it("should generate a different hex code on each click", async () => {
    const hexCodes = [];
    for (let i = 0; i < 5; i++) {
      await driver.findElement(By.tagName("button")).click();
      const hexCode = await driver.findElement(By.id("hexCode")).getText();
      hexCodes.push(hexCode);
    }
    const uniqueHexCodes = [...new Set(hexCodes)];
    assert.strictEqual(uniqueHexCodes.length, hexCodes.length);
  });

  it("should have a border around the color display box", async () => {
    const border = await driver
      .findElement(By.id("colorDisplay"))
      .getCssValue("border");
    assert.strictEqual(border.includes("solid"), true);
  });

  it("should allow clicking the Generate Color button", async () => {
    const button = await driver.findElement(By.tagName("button"));
    const isEnabled = await button.isEnabled();
    assert.strictEqual(isEnabled, true);
  });
});

