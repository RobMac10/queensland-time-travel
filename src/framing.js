// Framing text for the time-travel app. Everything here is either (a) the author's device (time travel, hub, return),
// (b) a plain restatement of text already used in the four story versions, or (c) navigation.
// No new historical claims are made in this file. Real history lives in src/eras/*.json with its sources.
window.FRAMING = {
title: 'Queensland Time Travel',
kicker: 'Time Travel on Country',
subtitle: 'Four eras of Queensland history. Visit each one, make the choices, and then see what really happened.',
siteHome: 'https://robmac10.github.io/history.html',
hero: { era: 'gold', image: 'gympie' },
intro: [
  'In this app you travel back in time to four eras of Queensland history. The app does not explain how you travel.',
  'In each era you take the place of a person who lived then. You see what they see and you make their choices. The people are invented. You cannot change history.',
  'When the story ends you come back to the present. A page called “What really happened” shows the real history and links to the information bank for that era.'
],
steps: [
  { n: '1', h: 'Travel', p: 'Choose an era. You arrive at that time and place.' },
  { n: '2', h: 'Choose', p: 'You take the place of an invented person and make their choices. Each choice has a cost.' },
  { n: '3', h: 'Return', p: 'Your visit ends and you are back in the present. Read what really happened.' }
],
bookLine: 'This app goes with the book Walking on Ancient Ground (Time Travel on Country, A Choose Your Own Character Adventure) by Robin McKean.',
warning: [
  'Cultural content warning. This app may contain names and images of deceased Aboriginal, Torres Strait Islander and South Sea Islander people.',
  'It is about frontier violence, racism, forced removal and unfair labour in Queensland. It does not describe violence in detail, but it does say that it happened. You can stop at any time. If it upsets you, talk to a teacher, a family member or someone you trust.'
],
review: 'Review status: this app has not yet been reviewed by Traditional Owners or by Australian South Sea Islander community groups. The author is not a member of these communities. Teachers, please seek advice from the Traditional Owners and community groups of your area before you use it in class.',
returnText: 'Your visit is over. You are back in the present. Nothing you chose changed history. Below is what really happened.',
// Order is by when each information bank’s history begins (1840, 1849, 1858, 1863).
order: ['grass', 'np', 'gold', 'sugar'],
eras: {
  grass: {
    name: 'The Grass Rush', short: 'Grass', span: [1840, 1902], spanLabel: '1840 to 1902', place: 'The Darling Downs and central Queensland',
    visitLabel: 'Starts in 1840, 1846 or 1869',
    blurb: 'Squatters take up the grassland of the Darling Downs for sheep. Over sixty years, who holds the grass, which animals eat it and who has a say all change.',
    who: ['Will, a shepherd (1846)', 'Alex, a station manager (1869)', 'An unnamed Aboriginal person (1840)'],
    color: '#b9cf5c', deep: '#3b4a1c', hero: 'yandilla',
    arrival: [
      'You travel back to the Darling Downs, in what is now Queensland. Your visit can start in 1840, 1846 or 1869. It depends on whose place you take.',
      'There are three invented people to choose from. The Aboriginal person has no name and no family group on purpose. You can come back and visit again as someone else.'
    ],
    arrivalReal: [['w2', 'real', 0], ['w2', 'real', 1]],
    countryReal: [['w2', 1]]
  },
  np: {
    name: 'The Native Police', short: 'Native Police', span: [1849, 1904], spanLabel: '1849 to 1904', place: 'Central Queensland',
    visitLabel: 'Set in the late 1870s',
    blurb: 'A force of Aboriginal men, led by white officers, is used to “disperse” Aboriginal people from land that settlers want. You play a young trooper who has to decide what to report.',
    who: ['Billy, a young trooper'],
    color: '#ee8a5f', deep: '#5a2414', hero: 'quay',
    arrival: [
      'You travel back to Central Queensland in the late 1870s. You take the place of Billy, an invented trooper of about seventeen in the Native Mounted Police.',
      'The Native Mounted Police was a force of Aboriginal men who were led by white officers. The story does not describe violence in detail, but the real history panels say plainly what the records show.'
    ],
    arrivalReal: [['camp', 'real', 1], ['briefing', 'real', 0]],
    begin: 'how',
    countryReal: [['ride', 1]]
  },
  gold: {
    name: 'The Gold Rush', short: 'Gold', span: [1858, 1877], spanLabel: '1858 to 1877', place: 'Canoona, Gympie, Charters Towers and the Palmer River',
    visitLabel: 'Starts in 1858, 1873 or 1874',
    blurb: 'Gold is found again and again between 1858 and 1877. Thousands of people rush to each field, and every field is on Aboriginal Country.',
    who: ['Sam, a labourer (1858)', 'Lin, a Chinese miner (1874)', 'An unnamed Aboriginal person (1873)'],
    color: '#f4bc3a', deep: '#5a4208', hero: 'gympie',
    arrival: [
      'You travel back to Queensland in the years of the gold rushes. Your visit can start in 1858, 1873 or 1874. It depends on whose place you take.',
      'There are three invented people to choose from. Each one lives through a different part of the gold rushes. The Aboriginal person has no name and no family group on purpose.'
    ],
    arrivalReal: [['s2', 'real', 0], ['a1', 'real', 0]],
    countryReal: [['a1', 0]]
  },
  sugar: {
    name: 'The Sugar Story', short: 'Sugar', span: [1863, 1908], spanLabel: '1863 to 1908', place: 'The Mackay district',
    visitLabel: 'Starts in 1884',
    blurb: 'Ships recruit young Pacific Islanders to work in Queensland’s sugar cane. Follow Harry from 1884 to the law of 1901 and the deportations of 1906 to 1908.',
    who: ['Harry, a young man from the New Hebrides'],
    color: '#55cdb0', deep: '#0f4a40', hero: 'mill',
    arrival: [
      'You travel back to 1884. You take the place of Harry, an invented young man of about seventeen from an island in the New Hebrides. The story follows him in the Mackay district, in Queensland, through to the law of 1901 and the years that came after it.',
      'The story does not name Harry’s island or language, because people from many islands were part of this history and one story cannot speak for all of them.'
    ],
    arrivalReal: [['landing', 'real', 0], ['ship', 'real', 0]],
    begin: 'how',
    countryReal: [['creek', 0], ['creek', 2]]
  }
},
behindApp: {
  intro: 'Everything in the stories is invented, but it is built on real history. This page lists what the time-travel app itself adds. The invented people and events of each era are listed on that era’s own Behind the Story page.',
  invented: [
    'The time travel. This app does not explain how you travel. It is a device that lets you visit each era, and nothing in the real history says that it can happen.',
    'The visitor (you). You do not have a name or a past in the app. You take the place of the invented person in each story and you return to the present when the story ends.',
    'The hub and the order of the stops. The eras are listed by when each information bank’s history begins. You can visit them in any order.',
    'The wording that opens each visit and the “Your visit is over” message. The author wrote these to join the stories together.',
    'The questions on the Back to Country page. They are the author’s questions, not facts.'
  ],
  kept: [
    'The four stories are the same stories that were written for the earlier choose-your-path apps. They are kept in the archive folder of each information-bank project on GitHub.',
    'Every scene has a “Real history” panel. Each fact in it has a source. Where the sources disagree, the panel says so.',
    'Images are old photographs, maps or drawings in the public domain, and each one is credited. There are no AI images.'
  ]
},
about: [
  'Queensland Time Travel joins four choose-your-path stories about Queensland history: the grass rush, the Native Mounted Police, the gold rushes and the sugar industry. Each story was first written as its own app, and each now has a non-fiction information bank. This app links the two.',
  'Use it for interest or in the classroom. Play at least two paths in an era, then read “What really happened” and the information bank. The question to ask each time is: what is invented, and what is real?'
],
privacy: 'This app has no tracking and no cookies. It uses your browser’s local storage only to remember which eras you have visited on this device. Nothing you do is sent anywhere. The button at the bottom of the hub clears it.',
country: {
  intro: [
    'You have visited all four eras. In each one, you stood on Country. The land was already the Country of Aboriginal peoples before the people in these stories arrived.',
    'Many of the records you read were written by settlers, officers and officials. They often did not write down what Aboriginal people thought. Aboriginal peoples survived, and their descendants live in Queensland today. This app cannot say what they thought and felt. Only they can say that.'
  ],
  questions: [
    'Which era changed what you thought? What did the Real history panel tell you that the story did not?',
    'Who is missing from the records you read? How could you find out more, and who should you ask?',
    'Choose one invented person. Which of their choices was the most free, and which was hardly free at all? Give your reasons.',
    'Whose Country do you live on? Find out the name of the people, and ask your teacher how to learn from them.'
  ]
},
teacher: {
  notes: [
    'Before you use this in class, please seek advice from the Traditional Owners of your area and from Australian South Sea Islander community groups (for example QUASSIC). The author is not a member of these communities and the app has not yet been reviewed by them.',
    'Give students the content warning before they start. Tell them they may stop at any time. Check whether any students have family connections to this history. Many Aboriginal and Australian South Sea Islander families do. Offer an alternative task if needed.',
    'A suggested sequence for one era: 5 minutes for the warning, 25 minutes for two paths, 10 minutes for “What really happened” and the information bank, and 15 minutes for the era’s discussion questions. The whole app suits several lessons.',
    'Each scene has a “Teacher notes” block, and each era has discussion questions with suggested answers. They are behind “Show” buttons. The student version has no answers in its code.',
    'The Aboriginal and South Sea Islander characters are written without names, language groups or customs on purpose. Please do not ask students to invent them.',
    'The Back to Country page opens when a student has reached an ending in all four eras. In this teacher version, you can open it at any time.'
  ],
  questions: [
    { q: 'In each era the land was already someone’s Country. Find one Real history panel in each era that names the Aboriginal peoples or says what they lost. What do the four panels have in common?',
      a: ['Grass Rush, scene “The outstation”: the Keinjan, Giabal, Jarowair and Barunggam peoples of the Darling Downs managed the grasslands with an annual burning season. Native Police, scene “Ridge Creek station”: the Darumbal people say that from the 1850s many of their people were driven from their land. Gold Rush, scene “Watching the strangers”: the Palmer River was the main source of food for Aboriginal people, and the miners worked in the same rivers. Sugar Story, scene “The creek”: the Mackay district includes the country of the Yuibera people, and the records show frontier violence there in the 1860s and 1870s.',
        'What they have in common: in each case Aboriginal people were already living on, using and caring for the land before the settlers arrived.'] },
    { q: 'Whose words survive in the records you read, and whose do not?',
      a: ['Most records were written by officers, officials and settlers. For the Native Police, no account is known from any trooper of how he was recruited. The stories do not claim to know what Aboriginal people thought. The information banks have a Real lives section, which gives documented accounts and uses a person’s own words only where a source records them.'] },
    { q: 'Compare how much real choice each invented person had.',
      a: ['Look for evidence in the Real history panels. Billy’s three ways of joining the force run from being taken to saying yes because there was no other way, and a trooper who refused or left had very few safe options. Harry made a mark on an agreement that he could not read, and the 1901 Act later limited his choices about staying. Will could choose between wages and a selection in 1869, and Alex depended on an owner, a bank and the weather. Lin could stay or go home, but from 1877 a £10 tax applied to new Chinese arrivals.',
        'Good answers use evidence from the panels and say which parts of the stories are invented.'] },
    { q: 'Where do the four eras overlap?',
      a: ['The Native Police appear in the Grass Rush story (a force arrives in 1849), in the Gold Rush story’s Palmer River path, in their own story and in the Sugar Story’s creek scene (barracks at Marlborough in 1866 and Bloomsbury in 1868). The Native Police story says that pastoral settlement of Central Queensland grew from the late 1840s. The Gold Rush and Sugar stories both show laws that controlled who could work: the 1877 law on Chinese arrivals and the Pacific Island Labourers Act 1901.'] },
    { q: 'Write a paragraph that compares one story with its Real history panel. Which parts are invented, and how do you know?',
      a: ['Marking guide: the student names a specific scene, uses at least two facts from its Real history panel with their sources, and separates them from what the story invents. Check the era’s Behind the Story page for the list of what is invented.'] }
  ]
}
};
