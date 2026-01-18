## Inspiration
We were inspired by a common problem in every friend group: planning is easy, but getting people to actually show up is not. Last-minute cancellations, vague excuses, and habitual flaking make group planning frustrating and unreliable. We wanted to turn this everyday social pain point into something fun and accountable by combining social scheduling with AI-driven behavior tracking.

## What it does
ExcuseMe is a social scheduling app that helps friend groups plan events while holding members accountable. Users can create groups, schedule activities, and invite friends to join. When someone opts out, they must submit a reason. Our AI system normalises different phrasings of the same excuse and checks it against the user’s past history. Repeated or suspicious excuses are flagged, and each user’s social credit score is updated based on their reliability. This gamifies commitment and makes group planning more transparent and fair.

## How we built it
We built ExcuseMe using Next.js and TypeScript to handle both the frontend and backend in a single, unified framework. This allowed us to rapidly develop features such as group management, event scheduling, and real-time interactions.

We used Shadcn UI to create a clean and consistent interface with reusable components, enabling fast iteration on product design without sacrificing flexibility. Clerk was integrated for secure user authentication and session management, allowing us to focus on core features instead of building auth from scratch.

On the backend, we used AI to normalise free-text excuses and detects repeated or suspicious patterns over time, enabling our social credit scoring system.

## Challenges we ran into
One major challenge was designing a system that could fairly judge excuses without being overly strict. Natural language is messy, and people phrase the same reason in many ways. Another challenge was modeling social behavior in the database while keeping the system simple enough to build within a hackathon timeframe. Balancing technical ambition with reliable execution was a constant tradeoff.

## Accomplishments that we're proud of
We are proud of building a working semantic excuse detection pipeline that goes beyond keyword matching. Our database design supports long-term behavioral analysis, enabling both global and group-level reputation scores. We also successfully combined humor with real system design principles, creating a product that is fun but technically serious.

## What we learned
We learned how to design a production-style system under tight time constraints by balancing technical ambition with practical execution. In particular, we gained experience integrating LLMs into real product logic rather than using them as simple chatbots. We also learned how important proper data modeling is when building social platforms, as tracking long-term user behavior requires careful database design. Finally, we improved our ability to collaborate efficiently and iterate quickly in a fast-paced hackathon environment.

## What's next for ExcuseMe
Next, we plan to improve the accuracy of our excuse classification system through fine-tuning and richer context analysis. We also aim to introduce predictive features, such as flake probability warnings and smart scheduling suggestions based on group behavior. In the long term, we envision expanding ExcuseMe into a full social coordination platform that helps groups build trust, reliability, and healthier social dynamics.
