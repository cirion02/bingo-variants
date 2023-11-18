javascript: (function()
{
    const B_LOGGING = true;
    const B_LOGGING_FULL_STACK = false;

    const BOARD = document.querySelector('table#bingo');

    if (BOARD.dataset.memExecuted === 'true'){
        alert('');
        return;
    }

    const TILES = document.querySelectorAll('.square');
    const GOAL_ACTION_INPUT = document.querySelector('#goal-entry-toggle');

    let MEM_INPUT = document.querySelector('#mem-toggle');
    let VALID_COLORS = ['orange', 'red', 'blue', 'green', 'purple', 'navy', 'teal', 'brown', 'pink', 'yellow'];
    let TILE_OBSERVERS = [];
    let ROOM_SETTINGS_OBSERVER;

    /* custom alert that starts with 'Memory → ' */
    function memAlert(message){
        window.alert('Memory → ' + message);
    }

    /* state functions */
    function getEnabled(){
        if (BOARD.dataset.memEnabled === 'true') {
            return true;
        }
        return false;
    }

    function setEnabled(boolean){
        BOARD.dataset.memEnabled = boolean;
        log('Enabled has been set to', boolean);
    }

    function toggleEnabled(){
        const b_new_enabled = !getEnabled();
        setEnabled(b_new_enabled);

        if (GOAL_ACTION_INPUT.checked === b_new_enabled) {
            GOAL_ACTION_INPUT.click();
        }

        if (b_new_enabled){
            resetMem();
            for (let i = 0; i < 25; i++){
                const observer = TILE_OBSERVERS[i];
                const tile = TILES[i];
                observer.observe(tile, {attributes: true});
            }

            ROOM_SETTINGS_OBSERVER.observe(document.querySelector('#room-settings-container'), {childList: true});
        } 
        else{
            showAllTiles();
            for (const observer of TILE_OBSERVERS){
                observer.disconnect();
            }
            ROOM_SETTINGS_OBSERVER.disconnect();
        }
    }

    /* tile functions */
    function getTileSlot(tile){
        return Number(tile.id.slice(4));
    }

    function getTileTextContainer(tile){
        const slot_number = getTileSlot(tile);
        const text_container = tile.querySelector('.text-container');
        if (text_container === null){
            log('Tile slot', slot_number, 'does not exist');
        }
        return text_container;
    }

    function hideTile(tile){
        const text_container = getTileTextContainer(tile);
        if (text_container === null) {
            return;
        }

        text_container.style.opacity = 0;
        log('Tile slot', getTileSlot(tile), 'has been hidden');
    }

    function hideAllTiles(){
        for (const tile of TILES){
            hideTile(tile);
        }
        log('All tiles have been hidden');
    }

    function showTile(tile){
        const text_container = getTileTextContainer(tile);
        if (text_container === null) {
            return;
        }
        text_container.style.opacity = 1;
        log('Tile slot', getTileSlot(tile), 'has been shown');
    }

    function showAllTiles(){
        for (const tile of TILES){
            showTile(tile);
        }
        log('All tiles have been shown');
    }

    function isTileTicked(tile){
        for (const color of VALID_COLORS){
            if (tile.title.includes(color)) {
                return true;
            }
        }
        return false;
    }

    /* Hides unticked and reveales ticked tiles */
    function resetMem(){
        log('The board has been reset');
        hideAllTiles();
        for (const tile of TILES){
            if (isTileTicked(tile)) {
                showTile(tile);
            }
        }
    }

    /* listeners and callbacks */
    function tileObserverCallback(mutations){
        const mutation = mutations[0];
        if (mutation.attributeName !== 'title') {
            return;
        }

        const tile = mutation.target; 
        if (isTileTicked(tile)) {
            showTile(tile);
        }
        else {
            hideTile(tile);
        }
    }

    function roomSettingsCallback(mutations){
        log('Room settings panel update detected');
        resetMem();
    }

    /* meta */
    function init(){
        setEnabled(true);
        /* bingosync fun (Bingosync doesn't update the chat unless you do this) */
        GOAL_ACTION_INPUT.click();GOAL_ACTION_INPUT.click();
        if (GOAL_ACTION_INPUT.checked) {
            GOAL_ACTION_INPUT.click();
        }
        log('The Goal Actions checkbox has been set to off');
        for (const tile of TILES){
            const observer = new MutationObserver(tileObserverCallback);
            observer.observe(tile, {attributes: true});
            TILE_OBSERVERS.push(observer);
        }
        log('Observers have been added to all tiles');
        ROOM_SETTINGS_OBSERVER = new MutationObserver(roomSettingsCallback);
        /* yes it has to be the container, every element below this gets deleted because fucking reasons */
        ROOM_SETTINGS_OBSERVER.observe(document.querySelector('#room-settings-container'), {childList: true});
        log('Observer has been added to the settings');

        const container = document.querySelectorAll('.checkbox')[0].parentElement;
        const hr = document.createElement('hr');container.appendChild(hr);

        resetMem();
        log('Memory has been enabled.');

        /* mem checkbox */
        const mem_div = document.createElement('div');
        const mem_label = document.createElement('label');
        const mem_input = document.createElement('input');
        const mem_checkbox_text = document.createTextNode('Memory');
        mem_div.classList.add('checkbox');
        mem_div.style = 'margin-bottom: 8px;';
        mem_input.id = 'mem-toggle';
        mem_input.type = 'checkbox';
        mem_input.checked = true;
        mem_input.addEventListener('change', toggleEnabled);
        MEM_INPUT = mem_input;
        mem_label.appendChild(mem_input);
        mem_label.appendChild(mem_checkbox_text);
        mem_div.appendChild(mem_label);
        container.appendChild(mem_div);

        log('The Memory element has been added to the menu');
    }

    /* helpers */
    function log(...data){
        if (!B_LOGGING) {
            return;
        }
        const time = '[' + new Date().toLocaleTimeString('pt-BR') + ']';
        const stack_str = new Error().stack.replaceAll(/@.*\s/g, ';').replaceAll(/;+/g, ';');
        const stack_array = stack_str.split(';');
        stack_array.splice(stack_array.indexOf('log'), 1);
        stack_array.pop();stack_array.reverse();
        if (!B_LOGGING_FULL_STACK) {
            stack_array.splice(0, stack_array.length-1);
        }
        const stack = stack_array.join('() > ') + '() >';
        console.log(time, stack, ...data);
    }

    BOARD.setAttribute('data-mem-executed', 'true');
    init();
    const enable_message = 'The Gamemode has been ENABLED.';
    memAlert(enable_message);
})() 