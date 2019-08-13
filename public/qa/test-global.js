
suite('全局测试', function () {
  test('页面必须包含title', function () {
    assert(document.title && document.title.match(/\S/) &&
      document.title.toUpperCase() !== 'TODO');
  });
});
