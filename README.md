# UBC-RMP

<p align="center">
  <img src="https://user-images.githubusercontent.com/9669739/54533519-9b636980-4947-11e9-8fc1-01f19acd4a86.png"/>
</p>

Browser extension for UBC course registration page to let students access Rate My Prof info easier

## Demo

![demo](https://user-images.githubusercontent.com/9669739/53616245-9015ed00-3b96-11e9-9b24-da52e92737c2.gif)

## Install


<a href="https://chrome.google.com/webstore/detail/ubc-rmp/iggomdckinfebdknahdgknkkjcjcfcld/"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_128x128.png" width="48" /></a>

Install it from [Chrome Web Store](https://chrome.google.com/webstore/detail/ubc-rmp/iggomdckinfebdknahdgknkkjcjcfcld/)

## Features

* Works on both course index page & specific section page

* Uses JSON scraped on both UBC courses page & Rate My Prof by [UBC-RMP-Data repo](https://github.com/jumbosushi/ubc-rmp-data)

* Call to action to create new professor profile if profile not found on RMP

![new_prof](https://user-images.githubusercontent.com/9669739/53614902-5e018c80-3b90-11e9-9eda-23bb5a13a149.gif)

* Call to action to add a review if no review found on existing profile

![no_review](https://user-images.githubusercontent.com/9669739/53615069-0f082700-3b91-11e9-8684-e7e33b94bccb.gif)

## Development

1. Clone the repo
2. Open Chrome and go to `chrome://extensions`
3. Enable Developer Mode via a toggle
4. Unpack the extension by selecting the cloned dir

## Why?

A typical workflow of a UBC student when registering a course is:
1. Open one of the sections in a new tab
2. Copy the professor name
3. Paste it into Rate My Prof (RMP) search box
4. Review ratings
5. Decide to add the course or not to the schedule
6. Repeat

Searching for RMP info gets time consuming real fast.

This extension hopes to make course registration less stressful than it already is

