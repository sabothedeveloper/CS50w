from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:name>", views.entry, name="entry"),
    path("wiki", views.index, name="list"),
    path("search/", views.search, name="search"),
    path("newpage", views.newpage, name="newpage"),
    path("checkentry", views.checkentry, name="checkentry"),
    path("editpage/<str:name>", views.editpage, name="editpage"),
    path("saveentry", views.saveentry, name="saveentry"),
    path("randompage", views.randompage, name="randompage")
]
