from django.http import HttpResponsePermanentRedirect

class HttpsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.is_secure() and not request.META.get('HTTP_X_FORWARDED_PROTO') == 'https':
            # Redirect to the HTTPS version of the URL
            secure_url = request.build_absolute_uri(request.get_full_path()).replace('http://', 'https://')
            return HttpResponsePermanentRedirect(secure_url)

        response = self.get_response(request)
        return response