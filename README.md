# EDArcade

**What is it?**

A 2D 360 degree arcade-style top-down endless scroller based on Elite Dangerous and written (quite badly) in Plain Old JavaScript. 

**Why is it?**

Because I like Elite Dangerous, and figured we needed a 2D arcade version. This seemed like a decent challenge for my first game attempt. 
And I was curious to see what I could a) figure out and b) pull off using just vanilla JS. And I learned a lot!

Fun fact: when Elite Dangerous first launched (I was a beta tier Kickstarter backer) the Cobra Mk3 had this little console looking thing that would have made an ideal screen to play this on, and I had the idea whilst making one of my flights out to [Hutton Orbital](https://elite-dangerous.fandom.com/wiki/Hutton_Orbital). I figured I might be able to hack something together and share it with Frontier in the hope that it might become a gift to players. However, I somewhat underestimated how long it would take to make _something_, never mind something _good enough_. 

Much like that trip to Hutton, there's still _so far_ to go with this project but I wanted to share it, faults and all, with anyone even vaguely interested. 

**What does it do?**

Even though it's old-style JS from top to bottom, there are quite a few things it does already (and yes, there are still _so many_ things to do to it yet). Here's a quick overview;

  * An infinite* scrolling background by means of re-tiling just one large image. It's not really infinite but you can go a very long way before the counters explode
  * Basic collision detection and reaction using the idea of a cellular construction of collidable zones
  * Some particle effects for thrust and damage indicators
  * Animations using sprite sheets
  * Ships modeled as JSON for future expansion
  * Keyboard, touch and gamepad controls (but gamepad isn't well supported yet)
  * Various stacked UI components for background, midground and foreground/UI layering
  * Variable damage based on e.g. weapon strength, shield levels, hull integrity
  * Pick-ups if you're good enough to actually destroy another ship - these may boost your weapons, shields, hull or finances
  * NPCs each controlled by an approximation of a finite state machine, whose behaviour is affected by motivation and circumstances
  * Threat levels according to the relationship between the player and NPCs e.g. you'll become a fugitive if you attack an innocent ship or the police, then you'll attract the attention of bounty hunters. Pirates are always threats and you can shoot them without a care :) Pirates will attack anyone but try to avoid bounty hunters and the police, and so on. 
  * You can earn credits by killing pirates (or any wanted ship) and then scoop up their dropped weaponry, cargo etc as a bonus.
  * Any collected weapons will automatically be mounted to vacant hardpoints on your ship, or replace an existing, lower-spec weapon.
  * Turreted weapons are available that will automatically track your current target's position so if you have a larger, slower ship those are very useful.
  * All ships have scanners that are able to identify targets, threats, pickups etc. The icons representing these various pings are rendered around the border of the screen.
  * It runs on computers reasonably well with a keyboard, and I've even played with some success on a phone and tablet but the touch controls (drawn as icons in the lower section of the screen automatically when a touch-enabled device is detected) aren't great.
  * It supports debug mode by adding `?debug` to the URL. This dislays your ships hardpoints, collision cells, thrust vectors and effective weapon range.
  * There's a practice mode where NPC ships are stuck in place - they can still rotate, shoot and fire their engines etc but they won't be able to move making it a bit easier to get in some target practice. Add `?practice` to the URL to enable it.
  
**How do I use it?**

Clone this repo. 
Run `./compile.sh` (or `compile.cmd` on Windows)
Open the `./dist/play/index.html` file in a browser and you should be good to go.

**Can I just play it now?**

Yes, there's [a functioning build on my github.io page](https://justinpinner.github.io/ed-arcade-playable/play/) if I haven't broken it.
  
**What's it about?**

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

I hope you like it, and learn how _not_ to do many of the things I've done wrong here.

**Credits**

This project drew on many invaluable resources including, but not limited to;

* Elite Dangerous (and of course its predecessors) by [Frontier Developments](https://www.frontierstore.net/).
* A Boids JavaScript implementation from Shane Hudson's book [Javascript Creativity](https://books.google.co.uk/books?id=Z6ThAwAAQBAJ) - my source for learning how to move things around on a Canvas element
* The ship graphics came from [elite-dangerous.wikia.com](http://elite-dangerous.wikia.com/wiki/Ships?file=EJwFwVEOwiAMANC7cABKywpxV_BHj0AYYZjNEqgfxuzuvvczn3GY1eyqfa4AW5tZxmanyki12CpSj5J6mzbLCUk15f0sb52AxOgCk3c-xoDsA2D0SM7RbWGiiAEjPDjfv89mX72a6w_7qyIR._2SoJRAPMgASbMzsNpw66yQhCqo.jpg)
* The explosion effect came from the [Unity VFX Image Sequencer](https://forum.unity3d.com/threads/release-thread-vfx-toolbox-image-sequencer.438465/) as recommended by [@sarahcarmody](https://twitter.com/sarahcarmody) but I've heavily pixelated it to protect the original creator's work as it's just used as a demonstration of spritesheet handling for animation here.
* The scrolling starfield background image is from [1-background.com](https://1-background.com/stars_1.htm)
* More [stackoverflow](http://stackoverflow.com/) heroes than you can shake a pointy stick at

