console.log("Email Writer Extension - Content Script Loaded");
function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;
}

function AIButton2() {
    const outer = document.createElement('div');
    outer.className = 'dC'; 
    outer.style.marginRight = '8px'
    outer.style.display = 'inline-flex';
    outer.style.alignItems = 'center';
    outer.style.borderRadius = '99999px'; 
    outer.style.overflow = 'hidden'; 
    outer.style.border = '1px solid #ccc'; 
    outer.style.background = '#f1f3f4'; 


    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    const more = document.createElement('select');
    more.className = 'T-I J-J5-Ji hG T-I-atl L3 ai-tone-dropdown'; 
    more.setAttribute('role', 'button');
    more.setAttribute('aria-haspopup', 'true');
    more.innerHTML='';
    more.setAttribute('title', 'Select Tone');

    const tones = ['Professional', 'Friendly', 'Casual', 'Formal'];
    tones.forEach(tone => {
        const option = document.createElement('option');
        option.value = tone.toLowerCase();
        option.textContent = tone;
        more.appendChild(option);
    });

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.setAttribute('disabled', 'true');

            const emailContent = getEmailContent();
            const selectedTone = more.value;

            const response = await fetch('http://localhost:8085/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone
                })
            });

            if (!response.ok) throw new Error('API Request Failed');

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                composeBox.innerText = ''; // clear previous reply if needed
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.log('Compose box not found');
            }
        } catch (error) {
            console.log(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.removeAttribute('disabled');
        }
    });

    outer.appendChild(button);
    outer.appendChild(more);
    return outer;
}

function intentButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 intent-reply-button';
    button.innerHTML = 'Intent Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply based on your intent.');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.setAttribute('disabled', 'true');

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            const emailContent = getEmailContent();
            const selectedTone = document.querySelector('.ai-tone-dropdown').value || 'professional';
            const userIntent = composeBox ? composeBox.innerText.trim() : '';

            const response = await fetch('http://localhost:8085/api/email/intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone,
                    intent: userIntent
                })
            });

            if (!response.ok) throw new Error('API Request Failed');

            const generatedReply = await response.text();
            if(composeBox){
                composeBox.focus()
                composeBox.innerText='';
                document.execCommand('insertText',false,generatedReply);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'Intent Reply';
            button.removeAttribute('disabled');
        }
    });

    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
        return null;
    }
}

function injectButton() {
    const existingButtonGroup = document.querySelector('.dC .ai-reply-button');
    if (existingButtonGroup) {
        existingButtonGroup.closest('.dC').remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, injecting AI button group");

    const outer = document.createElement('div');
    outer.className = 'dC'; 
    outer.style.marginRight = '8px'
    outer.style.display = 'inline-flex';
    outer.style.alignItems = 'center';
    outer.style.borderRadius = '99999px'; 
    outer.style.overflow = 'hidden'; 
    outer.style.border = '1px solid #ccc'; 
    outer.style.background = '#f1f3f4'; 

    const aiGroup = AIButton2();
    const aiReplyButton = aiGroup.querySelector('.ai-reply-button');
    const tone = aiGroup.querySelector('.ai-tone-dropdown');
    const intentReplyButton = intentButton();

    outer.appendChild(aiReplyButton);
    outer.appendChild(intentReplyButton);
    outer.appendChild(tone);

    intentReplyButton.style.display = 'none';
    aiReplyButton.style.display = 'inline-flex'

    toolbar.insertBefore(outer, toolbar.firstChild);

    const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
    if (composeBox) {
        composeBoxListener(composeBox, aiReplyButton, intentReplyButton);
    }
}

function composeBoxListener(composeBox, aiButton, intentButton){
    composeBox.addEventListener('input',()=>{ 
        
        const text = composeBox.innerText.trim();
        if(text.length > 0){
            aiButton.style.display = 'none';
            intentButton.style.display = 'inline-flex';
        }else{
            aiButton.style.display = 'inline-flex';
            intentButton.style.display = 'none';
        }
    })
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});


observer.observe(document.body, {
    childList: true,
    subtree: true
});




function findBelowToolbar() {
    const selectors = ['.nr.wR', '.amn']; 
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

function formatSummary(text){
    const lines = text.split('\n');
    let formatted = '';

    lines.forEach(line => {
        // Convert **bold** anywhere in the line
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong style="display:block; text-align:left;">$1</strong>');

        // Check if line starts with '* ' (pointer)
        if (/^\* /.test(line)) {
            // Remove the '* ' and wrap rest in <li>
            const content = line.replace(/^\* /, '');
            formatted += `<li>${content}</li>`;
        } else {
            // Just add line as a paragraph or heading (add <br> for spacing if needed)
            formatted += `<p>${line}</p>`;
        }
    });

    // Optional: wrap list items in <ul> if you'd like
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    return formatted;
}


function summariseButton() {
    const button = document.createElement('span');
    button.className = 'ams bkH summarise-button';
    button.style.marginRight = '8px';
    button.innerHTML = 'Summarise';
    button.setAttribute('role','link');
    button.setAttribute('title', 'Summarize this email');
    button.style.cursor = 'pointer';


    button.addEventListener('click',async ()=>{
        try {
            button.innerHTML='Summarising';
            button.setAttribute('disabled', 'true');

            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8085/api/email/summarise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "Professional"
                })
            });

            if (!response.ok) throw new Error('API Request Failed');

            const generatedReply = await response.text();

            const summaryBox = document.createElement('div');
            summaryBox.id = 'gmailgist-summary';
            summaryBox.style.marginTop = '10px';
            summaryBox.style.padding = '10px';
            summaryBox.style.background = '#f1f3f4';
            summaryBox.style.borderRadius = '6px';
            summaryBox.innerHTML = formatSummary(generatedReply) || '';


            const container = button.closest('.amn');
            if (container) {
                container.parentElement.appendChild(summaryBox);
            } else {
                console.error('Container not found to append summary.');
            }

        } catch (error) {
            console.log("Error in summarising..",error);
        } finally{
            button.innerHTML = 'Summarise';
            button.removeAttribute('disabled');
        }
    });

    return button;

}

function injectSummariseButton() {
    const existingButtons = document.querySelectorAll('.summarise-button');
    existingButtons.forEach(btn => btn.remove());

    const toolbar = findBelowToolbar();
    if (!toolbar) {
        console.log("Below Toolbar not formed.");
        return;
    }

    const summButton = summariseButton();
    summButton.classList.add('summarise-button');

    const replyBtn = toolbar.querySelector('.ams.bkH'); 
    if (replyBtn) {
        replyBtn.insertAdjacentElement('beforebegin', summButton);
    } else {
        toolbar.insertBefore(summButton, toolbar.firstChild);
    }

}

const summariseObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);

        const hasSummaryToolbar = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches('.nr.wR, .amn') || 
                node.querySelector('.nr.wR, .amn')
            )
        );

        if (hasSummaryToolbar) {
            console.log("Summary Toolbar Detected");
            setTimeout(() => {
                injectSummariseButton();
            }, 500);
        }
    }
});

summariseObserver.observe(document.body, {
    childList: true,
    subtree: true
});


