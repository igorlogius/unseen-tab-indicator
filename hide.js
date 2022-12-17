(function() {
    const UNSEENICON = "✨";
    if (document.title.startsWith(UNSEENICON)) {
        document.title = document.title.replace(UNSEENICON, "");
    }
})();

