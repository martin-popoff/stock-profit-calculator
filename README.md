# Stock calculator
Hello! This is a project created for an interview @ LucidLink by me.
The purpose of this project is to calculate the maximum possible profit for a specific stock with a provided budget and time window.

It consists of two parts: backend and frontend.
Following down is a bit more explanation as for why some features are missing or what I would have implemented anyway.

# Frontend
The frontend is a NextJS app using Tailwind for styling, React Aria for forms and Axios for simple fetch requests.

I've chosen to use Next for my front end since it is the easiest and simplest way (for me at least) to spin a React app and have most of the most important features right away. In this app I'm not making use of any of the useful features of Next, but it is my most familiar and favourite way to approach React.

For the styling, Tailwind is the easiest way to get a consistent design pattern, agreed upon by any development team and the easiest way to have consistent design throughout the application without any resources or time spent on developing a custom design scheme.

React Aria was a first for me, because I wanted to experiment with a library, that I haven't used before. At first glance it offers a lot of building blocks for creating great and accessable UIs and forms, but I found the documentation lacking and mostly slowing down my development process.

Axios was just a simple and elegant way to get fetch requests going and did not spend much time on figuring out a better way to approach fetches, as it is a simple app.

The frontend could have been improved in the following ways:
- Better responsive design
- Light/Dark mode
- Some additional explanations and tooltips for the forms
- Better feedback for the user (Table view of data or graph preview of buy/sell time)
- Using a library like React Query for caching (although the data is quite diverse to be appropriate for caching)

Most, if not all of these missing features, can be fixed with more testing/debuging and time.

# Backend
The backend uses NestJS with SQLite for a database mockup. 

My backend consists of two main modules: the stock module and the stock prices module, reached on the `/stock` and `/stock/:id/price` respectively. The stock prices module is a child module of the stock modules and they both have CRUD setup with a DTO that handles input sanitization and validation.

I've also included a few helper functions, such as a mocker, that will generate fake stock prices for a certain stock in order to test with a better data sample.

Overall I've tried to keep my structure clean and follow the architectural patterns that Nest recommends but as with any backend, it can be improved infinitely and here are some of the major points that I would improve on further down the line:
- Rate limiting with the built-in Nest rate limiter or using a ready solution like Upstash with a Redis database.
- Improving my API endpoints with both more features and better input sanitization
- Adding GraphQL support
- Unit testing
- More robust error codes
- Logging and handling exceptions on more layers

Again, most of these features were not implemented due to time constraints on my end, but I would love to finish this project on a later stage.
