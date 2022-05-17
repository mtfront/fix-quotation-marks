let button = document.getElementById("button");

button.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: fix,
    });
});

function fix() {
    // Input works, Google, Instagram, etc
    // 1. Notion, twitter and some rich text editor doesn't use standard input/textarea
    // 2. Mastodon will bounce this back for some reason (other textarea app works)

    // TODO
    // 1. Add input for copy into
    // 2. Add output for copy out of
    // 3. Add logic to switch button from extract and fix
    // 4. Ways to transfer from popup and content https://stackoverflow.com/questions/40645538/communicate-data-from-popup-to-content-script-injected-by-popup-with-executescri
    // 5. Detect what element does it have
    //  a. if no input area -> copy and paste route
    //  b. if mastodon (id mastodon) -> extract and paste
    //  c. if there's input and textarea -> direct replace

    const FRONT = '\u201C';
    const BACK = '\u201D';

    let textarea =  Array.prototype.slice.call(document.getElementsByTagName('textarea'), 0);   // converting HTMLCollection to array
    let input = Array.prototype.slice.call(document.querySelectorAll('input[type=text]'), 0);
    let everythingEverywhereAllAtOnce = textarea ? textarea.concat(input) : input;

    for (t of everythingEverywhereAllAtOnce) {
        let counter = 0
        let charArray = [...t.value];;
        for (let i = 0; i < charArray.length; i++) {
            let char = charArray[i];
            if (char == FRONT || char == BACK) {
                if (counter % 2 == 0 && char == BACK) {
                    charArray[i] = FRONT;
                } else if (counter % 2 == 1 && char == FRONT) {
                    charArray[i] = BACK;
                }
                counter++;
            }
        }
        fixed_counter > 0 ? alert(`fixed ${fixed_counter} characters`) : null;
        let result = charArray.join("");
        t.value = result;
    }
}
