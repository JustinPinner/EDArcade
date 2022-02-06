# EDArcade

**What is it?**

A 2D 360 degree top-down endless scroller based on Elite Dangerous. Written in Plain Old JavaScript. 

Note that the use of babel-minify is optional - just tweak the compile.sh script if you don't want to use it.

**Why is it?**

Because I like Elite Dangerous, and figured we needed a 2D arcade version. Seemed like a decent challenge for a first game attempt. 
And I was curious to see what I could make using just vanilla JS.

*But first... credit where it's due*

This project drew on many invaluable resources including, but not limited to;

* Elite Dangerous (and of course its predecessors) by [Frontier Developments](https://www.frontierstore.net/). I had to link to their store site here because it looks like their main domain is having an issue or two.
* A Boids JavaScript implementation from Shane Hudson's book [Javascript Creativity](https://books.google.co.uk/books?id=Z6ThAwAAQBAJ) - my source for learning how to move things around on a Canval element
* The ship graphics came from [elite-dangerous.wikia.com](http://elite-dangerous.wikia.com/wiki/Ships?file=EJwFwVEOwiAMANC7cABKywpxV_BHj0AYYZjNEqgfxuzuvvczn3GY1eyqfa4AW5tZxmanyki12CpSj5J6mzbLCUk15f0sb52AxOgCk3c-xoDsA2D0SM7RbWGiiAEjPDjfv89mX72a6w_7qyIR._2SoJRAPMgASbMzsNpw66yQhCqo.jpg)
* The explosion effect came from the [Unity VFX Image Sequencer](https://forum.unity3d.com/threads/release-thread-vfx-toolbox-image-sequencer.438465/) as recommended by [@sarahcarmody](https://twitter.com/sarahcarmody)
* The scrolling starfield background image is from [1-background.com](https://1-background.com/stars_1.htm)
* More [stackoverflow](http://stackoverflow.com/) heroes than you can shake a pointy stick at

**How do I use it?**

Clone this repo. 
Run ./compile.sh
Open the ./dist/play/index.html file in a browser

**What does it do?**

You are Commander Jameson, and you own a Cobra Mk III general-purpose ship. Congratulations!

When you are spawned into the galaxy there may or may not be much to see. 

But somewhere _out there_ lurk other ships, piloted by NPCs with their own agendas and motivations.

Use the up arrow key to fire up your main thrusters and start exploring the sky. The Enter key fires your lasers. Rotate with the left and right arrows, and the down arrow fires your retro thrusters for deceleration.

You may encounter nobody or be witness to a fight between a wanted pirate and the security services.

You may find a trader going quietly about their business, or drifting peacefully enjoying some downtime, or even being harrassed by a pirate wanting whatever is in their hold. They may be fighting back (good for them) or trying to get away (also good for them). Will you pitch in to fend off the attacker or stand back and watch how it plays out? Just remember, it could be _you_ in that situation and you'd probably really appreciate it if a passer-by helped out.

But what you do, and how you do it is up to you. 

Help the security ships bring down that pirate and you may find you can snag yourself some bonus cargo, weapons or shield upgrades that the pirate dropped in addition to any bounty that was offered for their elimination. 

Be sure not to hit the security ships with a stray laser beam though or you will be assumed to be a pirate sympathiser and suddenly find yourself on the receiving end of their attacks too.

Similarly, shooting at another vessel that is in no way a threat will instantly mark you as a wanted criminal, and other ships in the region may take notice, whether they be security ships or bounty hunters looking for an easy score.

If you happen upon a wanted ship, you're free to engage and other ships may even join in to help you if you're a respectable space citizen.

The area around the border of the screen shows other ships that are in scanner range, and the shape and colour of the symbol indicates whether they are a threat, an active target or a peaceful law-abiding vessel.

So yes, even in this primitive form the game offers quite a lot of features. And it is FAR from done yet. There will be bugs and there's not much actual gameplay besides the scenarios described above yet, but hopefully in time this will change.

Meanwhile, I hope you like it.

Stay safe out there commander 

o7

(Lots of people new to Elite wonder what o7 means when they see it in chats around the Internet. It's supposed to be a salute, albeit a left-handed one. So now you know!)
