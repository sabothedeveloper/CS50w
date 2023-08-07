from glob import escape
from logging import PlaceHolder
from multiprocessing import current_process
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist


from .models import User, listings, bids, comments


def index(request):
    return render(
        request,
        "auctions/index.html",
        {"listings": listings.objects.filter(is_active=True), "categories": False},
    )


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "auctions/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request, "auctions/register.html", {"message": "Passwords must match."}
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request,
                "auctions/register.html",
                {"message": "Username already taken."},
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


class NewTaskForm(forms.Form):
    name = forms.CharField(label="Listing name")
    description = forms.CharField(label="Description", max_length=250)
    bid = forms.DecimalField(label="Starting bid", max_digits=100, decimal_places=2, min_value=0, max_value=1000000)
    image = forms.URLField(label="Photo URL", required=False)
    category = forms.CharField(label="Category", required=False)


@login_required
def create_listing(request):
    if request.method == "POST":
        name = request.POST["name"]
        description = request.POST["description"]
        bid = request.POST["bid"]
        image = request.POST["image"]
        category = request.POST["category"]
        if category == "":
            category = "Not specified"
        seller = request.user
        listings.objects.create(
            name=name,
            description=description,
            bid=bid,
            image=image,
            seller=seller,
            current_price=bid,
            category=category,
        )
        return HttpResponseRedirect(reverse("index"))

    return render(request, "auctions/create_listing.html", {"form": NewTaskForm()})


def listing(request, listing_id):
    listing = listings.objects.get(id=listing_id)
    is_seller = False
    watchlist = None
    price = listing.bid
    if str(request.user) == (listing.seller):
        is_seller = True
    # https://stackoverflow.com/questions/16181188/django-doesnotexist
    if request.user.is_authenticated:
        try:
            watchlist = request.user.watchlist.get(id=listing_id)
        except ObjectDoesNotExist:
            watchlist = None
    try:
        price = bids.objects.get(listing_id=listing_id).bid
    except ObjectDoesNotExist:
        pass
    if listing.winner:
        if not request.user.id:
            return render(request, "auctions/error.html", {"message": "Bid closed!"})
        if int(listing.winner) == int(request.user.id):
            return render(
                request,
                "auctions/listing.html",
                {
                    "listing": listing,
                    "watchlist": watchlist,
                    "is_seller": is_seller,
                    "price": price,
                    "comments": comments.objects.filter(listing_id=listing_id),
                    "win": True,
                },
            )
        else:
            return render(request, "auctions/error.html", {"message": "Bid closed!"})

    return render(
        request,
        "auctions/listing.html",
        {
            "listing": listing,
            "watchlist": watchlist,
            "is_seller": is_seller,
            "price": price,
            "comments": comments.objects.filter(listing_id=listing_id),
        },
    )


@login_required(login_url="login")
def watchlist(request, listing_id):
    # https://stackoverflow.com/questions/26048602/how-do-i-get-the-name-of-a-form-after-a-post-request-in-django
    if request.method == "POST" and "add" in request.POST:
        request.user.watchlist.add(listings.objects.get(id=listing_id))
        return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
    if request.method == "POST" and "remove" in request.POST:
        request.user.watchlist.remove(listings.objects.get(id=listing_id))
        return HttpResponseRedirect(reverse("listing", args=(listing_id,)))
    return render(
        request, "auctions/watchlist.html", {"listings": request.user.watchlist.all()}
    )


@login_required(login_url="login")
def place_bid(request, listing_id):
    listing = listings.objects.get(id=listing_id)
    starting_bid = float(listing.bid)
    try:
        current_bid = float(bids.objects.get(listing_id=listing_id).bid)
    except ObjectDoesNotExist:
        current_bid = 0
        bids.objects.create(
            bid=current_bid, listing_id=listing_id, user_id=request.user.id
        )
    buyer_bid = float(request.POST["buyer_bid"])
    if buyer_bid > starting_bid and buyer_bid > current_bid:
        bid = bids.objects.get(listing_id=listing_id)
        listing.current_price = buyer_bid
        bid.bid = buyer_bid
        bid.user_id = request.user.id
        bid.listing_id = listing_id
        bid.save()
        listing.save()
    else:
        return render(
            request, "auctions/error.html", {"message": "Your bid is too small :("}
        )
    return HttpResponseRedirect(reverse("listing", args=(listing_id,)))


@login_required(login_url="login")
def close_listing(request, listing_id):
    try:
        winner = bids.objects.get(listing_id=listing_id).user_id
    except ObjectDoesNotExist:
        winner = -1
    listing = listings.objects.get(id=listing_id)
    listing.winner = winner
    listing.is_active = False
    listing.save()
    return HttpResponseRedirect(reverse("listing", args=(listing_id,)))


@login_required(login_url="login")
def comment(request, listing_id):
    comment = request.POST["comment"]
    comments.objects.create(comment=comment, listing_id=listing_id, user=request.user)
    return HttpResponseRedirect(reverse("listing", args=(listing_id,)))


def categories(request):
    # https://www.codegrepper.com/code-examples/python/django+get+distinct+values+from+queryset
    categories = listings.objects.values("category").filter(is_active=True).distinct()
    print(categories)
    return render(request, "auctions/categories.html", {"categories": categories})


def category(request, category):
    print(category)
    listingss = listings.objects.filter(category=category, is_active=True)
    return render(
        request, "auctions/index.html", {"listings": listingss, "categories": True}
    )
