getJson('http://khan4019.github.io/advJSDebug/scripts/story.json').then(function(story) {
  addHtmlToPage(story.heading);

  // Map our array of chapter urls
  // to an array of chapter json promises
  return story.chapterUrls.map(getJson).reduce(function(chain, chapterPromise) {
    // Use reduce to chain the promises together,
    // but adding content to the page for each chapter
    return chain.then(function() {
      return chapterPromise;
    }).then(function(chapter) {
      addHtmlToPage(chapter.html);
    });
  }, Promise.resolve());
}).then(function() {
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
});