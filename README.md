# UBC-RMP :books:

![rmp_demo](https://user-images.githubusercontent.com/9669739/50617380-c3dbdb80-0ea1-11e9-9f8f-8ec104fabc52.gif)

Browser extension for UBC course registration to let students access Rate My Prof info easier. Caches the response per course.

## Problem 

Typical workflow of a UBC student is:
1. Open one of the lectures in a new tab
2. Copy the professor name
3. Paste into Rate My Prof (RMP)
4. Add / Don't add the course to the worklist
5. Repeat

Searching for RMP info of the prof gets time consuming real fast.

## Solution

Expose RMP Professor data on course index page via cursor hover on lecture link

## Usage

1. Clone the repo
2. Open Chrome and go to `chrome://extensions`
3. Enable Developer Mode via a toggle
4. Unpack the extension by selecting the cloned dir

## Bug
:warning: **The app somehow makes the user log out after data load** :warning:

![wut](https://user-images.githubusercontent.com/9669739/50721130-fa1a8600-106e-11e9-8489-af8c4db8a804.gif)

When catching is disabled ssc somehow log the user out.  
Currently searching for a fix


