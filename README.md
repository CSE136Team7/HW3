# HW3
# Team 7
# due 16 May 2016


TODO:
-cache/expiration headers etc
-validation on server side
-validation on client side
-logging events
-raising exceptions when errors occur and keep track
-nice error pages
-404, 500, pages etc
-don’t throw stack traces. How do you trap them? How do you only throw them during debug and not production?
-fetch new data and not all the old data and the new data. Could do change locally and sync without fetching the data (ajax)
-minification (gulp)
-automation, pipelining (not having to ctrl c, node server.js whenever we make an edit) (heroku pipeline)

FINISHED:
-remove x-powered-by header
-cookie should say myapp.val=something instead of connect.sid=something
-navigating to / instead of /login gives a nice redirect to login
--now navigating to any unknown (or /root /admin /robot) will log a message
-logging occurs in console via debug.js. will change to write to file soon
-cookie is used to lookup user id, which is only associated with a session id after logging in
-add bookmark works
-can star a bookmark and view all starred bookmarks
-link the bookmark to the stored URL
-list bookmarks in a specific folder
-export and import
-implement sorting
-all button

To Do list:
-ajax client side
-ajax server side
-password reset/forgot password
-add and remove a bookmark to a folder
-make description take more than one space delimited token
-confirm delete modal


Notes for self:
Memory store: a default for express session (node dependency) to store cookies and data etc. Instead we are using 
express-mysql-session. Make sure not to revert to default at any point
Reset password: a more secure way to reset passwords would be to store user emails and send them a code or link via 
email that they must use to reset their passwords. Since there is no notion of admin users, we can leave this feature 
as is without any real risk to the website, but user accounts could be fairly easily 'stolen'.