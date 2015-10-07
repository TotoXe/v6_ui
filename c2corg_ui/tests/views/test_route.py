from c2corg_ui.tests.views import BaseTestUi


class TestRouteUi(BaseTestUi):

    def setUp(self):  # noqa
        self.set_prefix("/routes")
        BaseTestUi.setUp(self)

    def test_index(self):
        response = self.app.get(self._prefix, status=200)
        self.assertEqual(response.content_type, 'text/html')