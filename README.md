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
-fetch new data and not all the old data and the new data. Could do change locally and sync without fetching the data
-minification (gulp)
-automation (not having to ctrl c, node server.js whenever we make an edit)

FINISHED:
-remove x-powered-by header
-cookie should say myapp.val=something instead of connect.sid=something
-navigating to / instead of /login gives a nice 404. will change to redirect soon
--now navigating to any unknown (or /root /admin /robot) will log a message
-logging occurs in console via debug.js. will change to write to file soon
-cookie is used to lookup user id, which is only associated with a session id after logging in
-add bookmark works

To Do list:
-implement "all" button
-list bookmarks in a specific folder
-export and import?
-implement sorting
-set up a home button (when click on logo)  Constance
-error in login and signup on the page      Constance
-link the bookmark to the URL
-star
-password reset/forgot password
