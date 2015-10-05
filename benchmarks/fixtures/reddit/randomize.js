var titles = [
  "Ireland Says Yes: Early Results Indicate Win for Equal Marriage - “It’s a historical day for Ireland,” Minister for Health Leo Varadkar told RTÉ, adding that if any constituencies voted No, it would only be a handful.",
  "I like to send unsolicited duck pics to my SO",
  "Man...",
  "Every fucking day there's something. ISIS blowing people up, kids getting molested, another incident of large scale corruption.",
  "So my mom walked past a suspension yoga class",
  "Taylor Swift is not an “underdog”: The real story about her 1 percent upbringing that the New York Times won’t tell you.",
  "I have end stage kidney disease. I do home hemo dialysis and have in the past done hospital hemo dialysis and parateneal dialysis. AMA.",
  "One of the best prank calls I've ever seen",
  "Found a dog on the street. Never considered owning a dog. Fell In love. Now I own a dog. The story of a man and his trashmonster.",
  "Bad Breath?",
  "Medical professionals of Reddit, what mistake have you made in your medical career that, because of the outcome, you've never forgotten? [SERIOUS]",
  "User finds and shares his official Norwegian Navy beard-growing request form. It was compulsory to have a drawing of the beard they \"intended to have\".",
  "How do we know when a rock is a tool?: a discussion of archaeological methods",
  "The Justice Department is acknowledging that the FBI, DEA and other federal law enforcement agencies are likely to make increasing use of unmanned aerial drones in the United States",
  "A 3D plot of the planes that flew around my house last night [OC]",
  "Inside a sinkhole in the mountainous Xuanen county in central China's Hubei province. Photograph: Song Wen/Barcroft Media. From the Guardian. [1920 x 1277]",
  "Black Mass - Official Trailer #2 (starring Johnny Depp)",
  "Roman children shoes - Palmyra (Syria) [657x698]",
  "First attempt at Saturn",
  "Solved by Flexbox — Cleaner, hack-free CSS",
  "Another UI video. Getting more and more excited!",
  "Arch Linux - News: Data corruption on software RAID 0 when discard is used",
  "Nodejs scraping libraries comparison",
  "May 23rd - 30 Second Figure Drawings",
  "Vim Paper Color Theme Inspired By Google's Material Design"
];

document.documentElement.addEventListener('renderComplete', function() {
  window.done();
});

function render(count) {
  var data = {
    total: Math.floor(Math.random() * 1000),
    posts: new Array(count).join(' ').split(' ').map(function() {
      return { title: titles[Math.floor(Math.random() * titles.length)] };
    })
  };

  diff.outerHTML(document.documentElement, template.render(data), {
    enableWorker: true
  });
}
