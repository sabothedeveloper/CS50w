# Personal Blog Web App

This project is a personal blog website built using Django as the backend framework and JavaScript for the frontend interactions. The website allows users to create accounts, write and publish blog posts, comment on posts, and customize their posts. The project utilizes Bootstrap CSS for styling and responsiveness.

## Distinctiveness and Complexity

The personal blog web app satisfies the distinctiveness and complexity requirements in the following ways:

- **Distinctiveness**: The project goes beyond the scope of the other projects in the course by providing users with a platform to express themselves through blog posts. It's not a simple CRUD application but a full-fledged blogging platform with user authentication, commenting functionality, and dynamic frontend interactions.

- **Complexity**: The web app integrates both Django and JavaScript for a seamless user experience. It incorporates user authentication, multiple models (users, posts, comments), and user-specific customization of posts. The complexity lies in the interactions between the frontend and backend, the dynamic rendering of content, and the integration of multiple features.

## Files and Directories

- **article/**: Django app directory containing models, views, and templates for blog posts and comments.
- **static/**: Contains static files like CSS and images.
- **templates/**: Contains HTML templates for rendering web pages.
- **media/**: Upload directory for user-uploaded content.
- **manage.py**: Django management script for running commands.
- **requirements.txt**: List of Python packages required to run the app.

## How to Run the Application

1. Clone the repository:

```
git clone https://github.com/yourusername/personal-blog-web-app.git
cd personal-blog-web-app
```

1. Install required Python packages:

```
pip install -r requirements.txt
```

2.Run migrations to create the database:

```
python manage.py migrate
```

3. Create a superuser for admin access:

```
python manage.py createsuperuser
```

4. Run the development server:

```
python manage.py runserver
```

5. Access the application in your web browser at http://127.0.0.1:8000/.

## Additional Information

- The project makes use of Django's built-in authentication system for user registration and login.
- Users can create, edit, and delete their own blog posts.
- Users can comment on blog posts.
- The frontend is built using JavaScript and Bootstrap for a responsive design.
- Uploaded images are stored in the media directory.
- Make sure to check out the documentation in the code to understand how different components work.
  Credits
- This project was created by Your Name.

This project was developed as part of the CS50W course at Harvard University.
