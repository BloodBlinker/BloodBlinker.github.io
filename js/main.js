/* ==========================================================================
   RobinRoy — Portfolio scripts
   1. Navbar (scroll style + mobile toggle)
   2. Scroll-reveal animations
   3. Interactive hero terminal (boot sequence + typeable commands)
   ========================================================================== */

(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // mark that JS is available — enables the .reveal hide/show styles
    document.documentElement.classList.add('js');

    /* ----- 1. Navbar ----- */

    var navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var open = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open);
        });
        // close the menu after choosing a link
        navLinks.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ----- 2. Scroll-reveal ----- */

    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window && !reducedMotion) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ----- 3. Interactive terminal ----- */

    var term = document.getElementById('terminal-body');
    if (!term) return;

    // The boot sequence. cmd lines are "typed", out lines print instantly.
    var bootLines = [
        { cmd: 'whoami' },
        { out: 'robin_roy', cls: 't-dim' },
        { cmd: 'cat experience.txt' },
        { out: '• Business Central Technical Consultant (2+ yrs)', cls: 't-red' },
        { out: '• Cybersecurity Learner', cls: 't-green' },
        { out: '• Web & Blockchain Security Enthusiast', cls: 't-yellow' },
        { out: '• Daily study & documentation habit', cls: 't-blue' },
        { out: '' },
        { out: "Type 'help' to explore.", cls: 't-muted' }
    ];

    var commands = {
        help: [
            'available commands:',
            '  whoami           who is this guy?',
            '  ls notes         list my study notes',
            '  ls apps          my open-source apps',
            '  open <note>      open a note page',
            '  cat contact.txt  how to reach me',
            '  cat certs.txt    certifications',
            '  clear            clear the screen'
        ],
        whoami: [
            'robin_roy — developer climbing the cybersecurity mountain.',
            'B.Tech graduate · Business Central Technical Consultant (2+ yrs)',
            'Currently studying: TCM Security curriculum'
        ],
        'ls': [
            'apps/  notes/  skills/  certs.txt  contact.txt  experience.txt'
        ],
        'ls apps': [
            'martial-body   24-week MMA training programme   [on F-Droid]',
            'warrantyboxx   warranty & expiry tracker        [coming soon]',
            '',
            'free · open source · 100% offline — try: open apps'
        ],
        'ls notes': [
            'linux-basics.md        [published]',
            'programming-basics.md  [in progress]',
            'peh-notes.md           [in progress]',
            'burp-suite.md          [in progress]',
            '',
            "try: open linux-basics"
        ],
        'cat contact.txt': [
            'github   : github.com/BloodBlinker',
            'linkedin : linkedin.com/in/robin-roy-',
            'email    : robinroy3107@gmail.com'
        ],
        'cat experience.txt': [
            '• Business Central Technical Consultant @ Perfecta Consulting (2024–now)',
            '• IT Support Technician @ D Smart Technologies (2023–2024)',
            '• Cybersecurity Learner — TCM Security curriculum'
        ],
        'cat certs.txt': [
            'Linux 100: Fundamentals            TCM Security             2026',
            'D365 BC Developer Associate        Microsoft                2025',
            'Certified Penetration Tester       RedTeam Hacker Academy   2023',
            'Technical Support Fundamentals     Google / Coursera        2022'
        ]
    };

    function print(text, cls) {
        var line = document.createElement('div');
        if (cls) line.className = cls;
        // keep empty lines visible
        line.textContent = text || ' ';
        // during the boot sequence the input line isn't attached yet —
        // insertBefore with a detached reference node would throw
        if (inputLine.parentNode === term) {
            term.insertBefore(line, inputLine);
        } else {
            term.appendChild(line);
        }
        trim();
        term.scrollTop = term.scrollHeight;
    }

    function trim() {
        // keep the terminal from growing forever
        while (term.children.length > 60) {
            term.removeChild(term.firstChild);
        }
    }

    function run(raw) {
        var cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
        print('$ ' + raw, 't-green');
        if (!cmd) return;

        if (cmd === 'clear') {
            while (term.firstChild !== inputLine) term.removeChild(term.firstChild);
            return;
        }
        if (cmd === 'open linux-basics' || cmd === 'open linux-basics.md') {
            print('opening linux-basics.html ...', 't-dim');
            window.location.href = 'linux-basics.html';
            return;
        }
        if (cmd === 'open apps' || cmd === 'cd apps') {
            print('opening apps.html ...', 't-dim');
            window.location.href = 'apps.html';
            return;
        }
        if (cmd.indexOf('open ') === 0) {
            print('open: that note is still being written. check back soon!', 't-yellow');
            return;
        }
        if (cmd.indexOf('sudo') === 0) {
            print('robin_roy is not in the sudoers file. This incident will be reported.', 't-red');
            return;
        }
        if (commands[cmd]) {
            commands[cmd].forEach(function (l) { print(l, 't-dim'); });
            return;
        }
        print("bash: " + cmd.split(' ')[0] + ": command not found — try 'help'", 't-red');
    }

    // Build the input line (only exists when JS runs; static HTML is the fallback)
    var inputLine = document.createElement('div');
    inputLine.className = 'terminal-input-line';
    inputLine.innerHTML = '<span class="prompt">$</span>';
    var input = document.createElement('input');
    input.className = 'terminal-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'terminal command input');
    inputLine.appendChild(input);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            run(input.value);
            input.value = '';
        }
    });

    term.addEventListener('click', function () { input.focus(); });

    function startInteractive() {
        term.appendChild(inputLine);
        term.scrollTop = term.scrollHeight;
    }

    // Replace the static fallback content, then play the boot sequence.
    term.innerHTML = '';

    if (reducedMotion) {
        bootLines.forEach(function (l) {
            print(l.cmd !== undefined ? '$ ' + l.cmd : l.out, l.cmd !== undefined ? 't-green' : l.cls);
        });
        startInteractive();
    } else {
        var i = 0;
        (function next() {
            if (i >= bootLines.length) { startInteractive(); return; }
            var l = bootLines[i++];
            if (l.cmd !== undefined) {
                // type the command character by character
                var line = document.createElement('div');
                line.className = 't-green typing-cursor';
                term.appendChild(line);
                var pos = 0;
                var text = '$ ' + l.cmd;
                var t = setInterval(function () {
                    line.textContent = text.substring(0, ++pos);
                    if (pos >= text.length) {
                        clearInterval(t);
                        line.classList.remove('typing-cursor');
                        setTimeout(next, 250);
                    }
                }, 45);
            } else {
                print(l.out, l.cls);
                setTimeout(next, 80);
            }
        })();
    }
})();
