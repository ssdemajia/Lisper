suite('评论主页测试', function () {
  test('主页必须包括登陆按钮', function () {
    assert($('a[href="/oauth"]').length);
  });
});
