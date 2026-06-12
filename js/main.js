/* ==========================================================================
   RobinRoy — Portfolio scripts
   1. Navbar (scroll style + mobile toggle)
   2. Scroll-reveal animations
   3. Hero terminal animation (display only — no input)
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

    /* ----- 3. Terminal animation ----- */

    var term = document.getElementById('terminal-body');
    if (!term) return;

    // Intro sequence. cmd lines are "typed", out lines print instantly.
    var bootLines = [
        { cmd: 'whoami' },
        { out: 'robin_roy', cls: 't-dim' },
        { cmd: 'cat experience.txt' },
        { out: '• Business Central Technical Consultant (2+ yrs)', cls: 't-red' },
        { out: '• Cybersecurity Learner', cls: 't-green' },
        { out: '• Web & Blockchain Security Enthusiast', cls: 't-yellow' },
        { out: '• Daily study & documentation habit', cls: 't-blue' },
        { out: '' }
    ];

    // After the intro, these commands type out in an endless loop.
    var loopCommands = [
        'nmap -sC -sV target.com',
        'gobuster dir -u target.com -w common.txt',
        'cat ~/notes/linux-basics.md',
        './study_routine.sh --daily',
        'init_hacking_routine...'
    ];

    function addLine(text, cls) {
        var line = document.createElement('div');
        if (cls) line.className = cls;
        line.textContent = text || ' ';
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
        return line;
    }

    // Types `text` into `line` character by character, then calls done().
    function typeInto(line, text, done) {
        var pos = 0;
        var t = setInterval(function () {
            line.textContent = text.substring(0, ++pos);
            term.scrollTop = term.scrollHeight;
            if (pos >= text.length) {
                clearInterval(t);
                if (done) setTimeout(done, 250);
            }
        }, 45);
    }

    // One line at the bottom types each command, pauses, clears, repeats.
    function startLoop() {
        var line = addLine('', 't-green typing-cursor');
        var i = 0;
        (function cycle() {
            typeInto(line, '$ ' + loopCommands[i], function () {
                i = (i + 1) % loopCommands.length;
                setTimeout(function () {
                    line.textContent = '';
                    cycle();
                }, 2000);
            });
        })();
    }

    // Replace the static fallback content, then animate.
    term.innerHTML = '';

    if (reducedMotion) {
        bootLines.forEach(function (l) {
            addLine(l.cmd !== undefined ? '$ ' + l.cmd : l.out, l.cmd !== undefined ? 't-green' : l.cls);
        });
        addLine('$ init_hacking_routine...', 't-green typing-cursor');
    } else {
        var i = 0;
        (function next() {
            if (i >= bootLines.length) { startLoop(); return; }
            var l = bootLines[i++];
            if (l.cmd !== undefined) {
                var line = addLine('', 't-green typing-cursor');
                typeInto(line, '$ ' + l.cmd, function () {
                    line.classList.remove('typing-cursor');
                    next();
                });
            } else {
                addLine(l.out, l.cls);
                setTimeout(next, 80);
            }
        })();
    }
})();
