const containsClass = () => async (element, testClass) => {
  const className = await element.getAttribute("class");
  return (await className.indexOf(testClass)) !== -1;
};

module.exports = containsClass;
