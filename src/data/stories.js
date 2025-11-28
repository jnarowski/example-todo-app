/**
 * Story data collection for the "Tell me a story" feature
 * Contains diverse short stories including fables, parables, and folktales
 */

const stories = [
  {
    title: "The Oak and the Reed",
    content: "An oak tree and a reed grew beside a river. The oak was proud and strong, boasting of its might. 'I stand firm against any wind,' it declared. The reed, humble and flexible, simply swayed with the breeze.\n\nOne day, a terrible storm came. The oak stood rigid, refusing to bend. The wind howled and pushed, and eventually, the great oak was uprooted and fell. The reed, meanwhile, bent low with each gust, touching the ground but never breaking.\n\nWhen the storm passed, the reed stood upright again, unharmed. The moral: Sometimes yielding is stronger than resistance. Flexibility and adaptability can be greater strengths than rigid power.",
    author: "Aesop"
  },
  {
    title: "The Two Wolves",
    content: "An old Cherokee was teaching his grandson about life. 'A fight is going on inside me,' he said to the boy. 'It is a terrible fight between two wolves.\n\nOne wolf is evil—he is anger, envy, sorrow, regret, greed, arrogance, self-pity, guilt, resentment, inferiority, lies, false pride, superiority, and ego. The other wolf is good—he is joy, peace, love, hope, serenity, humility, kindness, benevolence, empathy, generosity, truth, compassion, and faith.\n\nThe same fight is going on inside you, and inside every other person, too.'\n\nThe grandson thought about it for a minute and then asked, 'Which wolf will win?'\n\nThe old Cherokee simply replied, 'The one you feed.'",
    author: "Cherokee Legend"
  },
  {
    title: "The Cracked Pot",
    content: "A water bearer in India had two large pots, each hung on opposite ends of a pole. One pot was perfect, while the other had a crack. At the end of the long walk from the stream to the house, the cracked pot always arrived only half full.\n\nFor two years this went on, with the bearer delivering only one and a half pots of water. The perfect pot was proud of its accomplishments. But the poor cracked pot was ashamed of its imperfection.\n\nOne day, the cracked pot spoke to the water bearer: 'I am ashamed of myself, because this crack in my side causes water to leak out all the way back to your house.'\n\nThe bearer smiled kindly. 'Did you notice that there are flowers on your side of the path, but not on the other pot's side? That's because I have always known about your flaw, so I planted flower seeds on your side of the path. Every day while we walk back, you water them. For two years I have been able to pick these beautiful flowers to decorate my table. Without you being just the way you are, I would not have this beauty to grace my house.'",
    author: "Traditional Indian Tale"
  },
  {
    title: "The Student and the Master",
    content: "A university professor came to visit a famous Zen master. While the master quietly served tea, the professor talked about Zen, explaining his theories and interpretations.\n\nThe master poured the visitor's cup full, and then kept pouring. The professor watched the overflow until he could no longer restrain himself.\n\n'It's full! No more will go in!' the professor exclaimed.\n\n'Like this cup,' the master replied, 'you are full of your own opinions and speculations. How can I show you Zen unless you first empty your cup?'\n\nThe lesson is simple: to truly learn something new, we must first be willing to empty ourselves of our preconceptions and assumptions. An open mind is essential for growth and understanding.",
    author: "Zen Parable"
  },
  {
    title: "The Starfish Story",
    content: "An old man walked along a beach at dawn, noticing a young woman ahead of him picking up starfish and flinging them into the sea. He caught up with her and asked why she was doing this.\n\n'The stranded starfish will die if left in the morning sun,' she answered.\n\n'But the beach goes on for miles, and there are millions of starfish,' the old man replied. 'How can your effort make any difference?'\n\nThe young woman looked at the starfish in her hand and then threw it to safety in the waves. 'It makes a difference to this one,' she said.\n\nWe cannot do everything, but we can do something. Our individual acts of kindness and compassion matter, even when the problems seem overwhelming. Each small action creates ripples of positive change.",
    author: "Adapted from Loren Eiseley"
  },
  {
    title: "The Farmer's Horse",
    content: "A farmer's horse ran away. His neighbor came to console him, saying, 'Such bad luck!'\n\n'Maybe,' the farmer replied.\n\nThe next day, the horse returned, bringing with it three wild horses. 'How wonderful!' the neighbor exclaimed.\n\n'Maybe,' replied the farmer.\n\nThe following day, the farmer's son tried to ride one of the wild horses and was thrown off, breaking his leg. 'How terrible!' the neighbor said.\n\n'Maybe,' answered the farmer.\n\nThe day after that, military officials came to the village to draft young men into the army. Seeing the son's broken leg, they passed him by. 'Such great fortune!' the neighbor said.\n\n'Maybe,' said the farmer.\n\nThis ancient tale reminds us that life's events are neither wholly good nor wholly bad. What seems like misfortune may lead to blessing, and apparent blessings may bring challenges. Wisdom lies in responding to each moment without rushing to judgment.",
    author: "Taoist Parable"
  },
  {
    title: "The Blind Men and the Elephant",
    content: "Six blind men were asked to determine what an elephant looked like by feeling different parts of the elephant's body.\n\nThe first man, whose hand touched the elephant's side, said, 'The elephant is like a wall.'\n\nThe second, feeling the tusk, said, 'It is like a spear.'\n\nThe third, holding the trunk, declared, 'The elephant is like a snake.'\n\nThe fourth, touching the leg, said, 'It is like a tree.'\n\nThe fifth, feeling the ear, insisted, 'The elephant is like a fan.'\n\nThe sixth, grasping the tail, said, 'It is like a rope.'\n\nThey argued among themselves, each convinced he was right. A wise man passing by heard their dispute. 'All of you are right,' he said. 'Each of you touched a different part of the elephant. You must put all your experiences together to understand the whole truth.'\n\nThis story teaches us that our individual perspectives are limited. True understanding often requires us to listen to others and integrate different viewpoints.",
    author: "Indian Parable"
  },
  {
    title: "The Stonecutter",
    content: "There was once a stonecutter who was dissatisfied with his life. One day, he passed a wealthy merchant's house and wished, 'I wish I were a merchant!' To his amazement, he became one.\n\nBut soon he saw a high official pass by, carried in a sedan chair. 'I wish I were a high official!' he thought, and became one.\n\nYet, on a hot summer day, he realized even his power wilted under the sun. 'The sun is mightier than I! I wish to be the sun!' He became the sun, scorching the earth.\n\nBut then a cloud moved between him and the earth, blocking his rays. 'The cloud is mightier! I wish to be a cloud!' As a cloud, he rained down, causing a flood—until he met a mountain that would not be moved.\n\n'The mountain is mightiest! I wish to be a mountain!' As a mountain, he stood unmoved—until he felt a sharp pain. Looking down, he saw a stonecutter chipping away at his base.\n\nAt last, he understood: his original life had held the power to shape even mountains. True contentment comes not from wishing to be someone else, but from recognizing and embracing the unique power within ourselves.",
    author: "Japanese Folktale"
  }
];

/**
 * Returns a random story from the collection
 * @returns {Object} Story object with title, content, and author properties
 */
export function getRandomStory() {
  // Handle edge case of empty array
  if (stories.length === 0) {
    return {
      title: "No Stories Available",
      content: "There are currently no stories in the collection. Please check back later!",
      author: "System"
    };
  }

  const randomIndex = Math.floor(Math.random() * stories.length);
  return stories[randomIndex];
}

export default stories;
