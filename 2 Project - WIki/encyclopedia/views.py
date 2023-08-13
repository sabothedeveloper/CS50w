from audioop import reverse
from html import entities
import re, os.path, random
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
import markdown2

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {"entries": util.list_entries()})


def entry(request, name):
    entry = util.get_entry(name)
    if entry == None:
        return render(
            request, "encyclopedia/entry.html", {"entry": entry, "name": name}
        )
    # rendering the markdown using the library
    # entry = markdown2.markdown(entry)
    split = entry.split("\n")
    # removing leftover \r's and whitespace elements from our list
    split = [
        element.replace("\r", "")
        for element in split
        if element != "" and element != "\r"
    ]
    new = []
    # https://stackoverflow.com/questions/2763750/how-to-replace-only-part-of-the-match-with-python-re-sub
    # converting each element to html
    for element in split:
        if "#" in element:
            element = re.sub("^# ([^#]+)", r"<h1>\1</h1>", element)
            element = re.sub("^## ([^#]+)", r"<h2>\1</h2>", element)
            element = re.sub("^### ([^#]+)", r"<h3>\1</h3>", element)
            element = re.sub("^#### ([^#]+)", r"<h4>\1</h4>", element)
            element = re.sub("^##### ([^#]+)", r"<h5>\1</h5>", element)
            element = re.sub("^###### ([^#]+)", r"<h6>\1</h6>", element)
        elif "**" in element or "__" in element:
            element = re.sub("\*\*([^\*]+)\*\*", r"<b>\1</b>", element)
            element = re.sub("__([^\_]+)__", r"<b>\1</b>", element)
            element = re.sub("(.+)", r"<p>\1</p>", element)
        elif "*" in element:
            element = re.sub("^\* ([^\*]+)", r"<li>\1</li>", element)
        elif re.match("([\w 0-9]+)\[([^[]+)\]\(([^\(]+)\)", element):
            element = re.sub(
                "([\w 0-9]+)\[([^[]+)\]\(([^\(]+)\)", r'\1<a href="\3">\2</a>', element
            )
            element = re.sub("(.+)", r"<p>\1</p>", element)
        else:
            element = re.sub("(.+)", r"<p>\1</p>", element)
        new.append(element)
    # moving all the li elements into ul
    add_ul(new)
    # https://www.simplilearn.com/tutorials/python-tutorial/list-to-string-in-python#:~:text=To%20convert%20a%20list%20to%20a%20string%2C%20use%20Python%20List,and%20return%20it%20as%20output.
    # converting our list to string
    entry = " ".join(new)
    return render(request, "encyclopedia/entry.html", {"entry": entry, "name": name})


def search(request):
    # https://stackoverflow.com/questions/53920004/add-q-searchterm-in-django-url
    name = request.GET.get("q")
    entry = util.get_entry(name)
    # if we couldn't find corresponding entry, render page with the results
    if entry == None:
        match = []
        entries = util.list_entries()
        # checking if our search entry is a substring of any entries
        for entry in entries:
            if name.lower() in entry.lower():
                match.append(entry)
        return render(request, "encyclopedia/search_results.html", {"entries": match})
    # if found a corresponding entry, get redirected to that page
    return HttpResponseRedirect(f"../wiki/{name}")


def newpage(request):
    return render(request, "encyclopedia/newpage.html")


def checkentry(request):
    title = request.GET.get("title")
    entry = request.GET.get("entry")
    # https://www.pythontutorial.net/python-basics/python-check-if-file-exists/
    if os.path.exists(f"entries/{title}.md"):
        return render(request, "encyclopedia/newpage.html", {"check": True})
    with open(f"entries/{title}.md", "w") as file:
        file.write(entry)
    return HttpResponseRedirect(f"../wiki/{title}")


def editpage(request, name):
    return render(
        request,
        "encyclopedia/edit_page.html",
        {"name": name, "entry": util.get_entry(name)},
    )


def saveentry(request):
    title = request.GET.get("title")
    entry = request.GET.get("entry")
    with open(f"entries/{title}.md", "w") as file:
        file.write(entry)
    return HttpResponseRedirect(f"../wiki/{title}")


def randompage(request):
    entries = util.list_entries()
    return HttpResponseRedirect(f"../wiki/{random.choice(entries)}")


def add_ul(new):
    first = 0
    check = False
    for i in range(len(new)):
        if "<li>" in new[i]:
            check = True
            first = i
            break
    last = 0
    for i in range(len(new)):
        if "<li>" in new[i]:
            last = i
    if check == True:
        new.insert(first, "<ul>")
        new.insert(last + 2, "</ul>")
    return new
