# HW3
# Team 7
# due 16 May 2016

## HW5 Description

## Description Button

FINISHED:
-remove x-powered-by header
-cookie should say BookmarxTeam7=something instead of connect.sid=something
-navigating to / instead of /login gives a nice redirect to login
--now navigating to any unknown (or /root /admin /robot) will log a message
-logging occurs in console via debug.js. also writes to file with timestamp
-cookie is used to lookup user id, which is only associated with a session id after logging in
--session is destroyed anytime a user attempts to access internal pages without a user id
-add bookmark  
-can star a bookmark and view all starred bookmarks
-link the bookmark to the stored URL
-list bookmarks in a specific folder
-export and import
-implement sorting
-all button
-confirm delete modal
-password reset/forgot password
-uptime of Heroku deployed version of HW5(https://cse136hw5.herokuapp.com/login)
 with status at pingdom(http://stats.pingdom.com/wj1nd7oq5yws)
-using google analytics as well
-fetch new data and not all the old data and the new data. Could do change locally and sync without fetching the
data (ajax)
-minification
-bundling
-some reduction of dependency size (reduce font awesome, etc)
-add and remove a bookmark to a folder
-write to local file for debug purposes (can turn off debugging easily in debug.js)
-validation on server side
-validation on client side

To Do list:
-make description take more than one space delimited token

#Notes for how to improve the site:
Reset password: a more secure way to reset passwords would be to store user emails and send them a code or link via
email that they must use to reset their passwords. Since there is no notion of admin users, we can leave this feature
as is without any real risk to the website, but user accounts could be fairly easily 'stolen'. If we wanted we could
set up an automatic mail service and alter the db to require an email. We could generate unique codes that get sent
in the email and have to be entered in with the new password.

Partial page update: right now, when the bookmarks display updates, we update the entire bookmarks list and the server
doesn't send the nav bars etc (when ajax is possible). In the future, we would only send the changed or added bookmarks

Paging: in large scale (of books for a single user) eventually we would have some sort of limit for how many books
can be displayed on a particular page so that we don't attempt to render an obscene number at once. We would determine
how many the limit is (by default) by testing how many books we can load and still have the data render quickly enough.
Options would be included to allow the user to view more bookmarks at once but knowing it will slow the page.


#Member contributions

Bhavik:
  Server Side Rendering
  Client side Rendering
  ajax
  Rendering based on availability of JS
  Building routes
  CRUD operations for bookmarks Client and Server
  Import / Export Client and Server
  Search / Sort Client and Server
  Debugging errors
  Creating EJS templates
  Implementing user analytics (Incomplete)

Balkrishna:
set up project 1,2,3, set up digital ocean(automatic deployment), set up heroku, tested schema ,create, edit, delete, get folders on both client side with ajax and server side rendering, changed lot of css and html from original template, minify the app using gulp, fix errors related to database, deployment as well as app.

Brian:
client side/server side validation, getting bookmarks to go to their respective URL, various html/css changes, starred/most visited on ajax, worked with Bhavik on ajax functionality, various bug fixes

Constance:login, password hashing, working with sachi on sessioning, fixed html and css throughout the project, manage team.

Max:

Sachi: database backend - created database sql schema and some dummy data to test with, useful queries sessioning - got it up and running and changed headers/cookie names to be app specific some redirects and debug messages - site would display "please use back button" on unknown urls confirm delete - modal to confirm delete reset password/forgot password - functionality and html page to support reset/forgot password some styling - html/css some logging/user analytics - debug.js log to file, making error messages readable throughout code other various additions, debugging, merging, cleanup, version control tasks
