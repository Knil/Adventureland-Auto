//Modified Default code. Currently changes are it only uses HP when the Damage is 200 or more, as to not waste potions.

//Goals: 1. Create monster Targeting as to not auto target monsters with to much HP. Hopefully scale to current level as to make it easy to plug into new characters at level 1 to start farming. currently it uses attack value as the filter, but monsters with low attack but high hp are still to long to kill
//2. Create a MP refill option also
//3. Create an Inventory check to ensure that we don't run out of potions, and that we can automatically refill them when needed.
//4. Create a loop for questing/returning to town. that way after returning to town to sell loot, buy potions and possibly gear, it can also head back out automatically. 
//5. Create a Gear Buying Section that compares the value of current gear to vendor gear and buys upgrades focusing on empty slots first, then replacing gear with anything that fits the criteria better. also do this  with any looted gear.
//6. Create an auto trade with my merchant character in town who will be a drop point for loot. Eventually I'll create an auto listing option on the merchant, but if the character can just drop stuff off initally I can manually trade and craft



var attack_mode=true;
// Function to run every 1/4 second
setInterval(function(){

	var currentDamage = character.maxHP - character.hp; //get the current lost hp
	if(currentDamage >= 200) use_hp(); //heal if the damage is the same value as the default hp item ToDo: Make it variable based on a selected HP item and buy new ones as needed. also use recovery skills first if possible, and check for in combat if not in combat it's okay to wait for some auto-regen before using a pot.
	var currentMPUsage = character.maxMP - character.MP; //get the current used MP
	if (currentMPUsage >= 200 || character.mp >= 10) use_mp();// use a mana pot if the mp is below 200, or if they have less than 10 MP (in case of characters with less than 200 MP. TODO: Make it inventory dependant, and use recovery skills before using a pot.
	
	loot(); //probably want a more refined looting system as well. I want to make it not worry about things below a certain value after a certain level.

	if(!attack_mode || character.rip || is_moving(character)) return; //check if the flag at the begining is set, if the character is dead or is moving, if true, return and don't do anything else

	var target=get_targeted_monster(); //grabs the current targeted monster, then checks to see if there is one.
	if(!target) 
	{
		target=get_nearest_monster({min_xp:100,max_att:20}); //Grabs a monster that has a min XP of 100 and a max attack of 20
		if(target) change_target(target);// if a monster fits the criteria, change target to the monster
		else
		{
			set_message("No Monsters"); //return if no valid target
			return;
		}
	}
	
	if(!in_attack_range(target)) // If the monster isn't close enough
	{
		var halfdistancex = character.x+(target.x-character.x)/2; //Calculates the halfwaypoint between you and the monster on the x axis
		var halfdistancey = character.y+(target.y-character.y)/2; //same, but for y axis
		move(
			halfdistancex,
			halfdistancey
			);
		// Walk half the distance to the target. TODO: clean up move action to make it more fluid, as well as not moving toward hostile mobs. I think i could make it so if the targeting detects a strong monster, it runs away, even if there are weaker monsters in range
	}
	else if(can_attack(target)) //If you can attack the target do so
	{
		set_message("Attacking");
		attack(target);
	}

},1000/4); // Loops every 1/4 seconds.

