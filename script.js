// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling and section switching
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

// Scroll to section function for buttons
function scrollToSection(sectionId) {
    showSection(sectionId);
}

// Love Counter functionality
let counterInterval;

function initLoveCounter() {
    const startDateInput = document.getElementById('start-date');
    
    // Check if there's a saved date in localStorage
    const savedDate = localStorage.getItem('loveStartDate');
    if (savedDate) {
        startDateInput.value = savedDate;
    } else {
        // Set default date to one year ago
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 1);
        startDateInput.value = defaultDate.toISOString().split('T')[0];
    }
    
    updateCounter();
}

function updateCounter() {
    const startDateInput = document.getElementById('start-date');
    const startDate = new Date(startDateInput.value);
    const now = new Date();
    
    if (startDate > now) {
        alert('Please select a date in the past!');
        return;
    }
    
    // Save the date to localStorage
    localStorage.setItem('loveStartDate', startDateInput.value);
    
    // Clear existing interval
    if (counterInterval) {
        clearInterval(counterInterval);
    }
    
    // Update counter immediately
    updateCounterDisplay(startDate, now);
    
    // Update counter every second
    counterInterval = setInterval(() => {
        updateCounterDisplay(startDate, new Date());
    }, 1000);
}

function updateCounterDisplay(startDate, currentDate) {
    const timeDiff = currentDate - startDate;
    
    // Calculate years, months, days, hours, minutes, seconds
    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
    const remainingAfterYears = timeDiff % (1000 * 60 * 60 * 24 * 365.25);
    const months = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30.44));
    const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30.44);
    const days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update the individual counter displays
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    
    // Update the duration text
    updateDurationText(years, months, days, hours, minutes, seconds);
}

function updateDurationText(years, months, days, hours, minutes, seconds) {
    const durationText = document.getElementById('duration-text');
    let text = '';
    
    if (years > 0) {
        text += `${years} year${years !== 1 ? 's' : ''}`;
        if (months > 0 || days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
            text += ', ';
        }
    }
    
    if (months > 0) {
        text += `${months} month${months !== 1 ? 's' : ''}`;
        if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
            text += ', ';
        }
    }
    
    if (days > 0) {
        text += `${days} day${days !== 1 ? 's' : ''}`;
        if (hours > 0 || minutes > 0 || seconds > 0) {
            text += ', ';
        }
    }
    
    if (hours > 0) {
        text += `${hours} hour${hours !== 1 ? 's' : ''}`;
        if (minutes > 0 || seconds > 0) {
            text += ', ';
        }
    }
    
    if (minutes > 0) {
        text += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        if (seconds > 0) {
            text += ', ';
        }
    }
    
    if (seconds > 0) {
        text += `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    
    // If all values are 0, show a default message
    if (text === '') {
        text = '0 seconds';
    }
    
    durationText.textContent = text;
}

// Music Player functionality
let isPlaying = false;
let audioPlayer;
let currentSongIndex = 0;
let isShuffle = false;
let repeatMode = 'none'; // 'none', 'one', 'all'
let songs = [
    { title: "Amarain", artist: "Various Artists", src: "01. Amarain.mp3" },
    { title: "Awedony", artist: "Various Artists", src: "01. Awedony.mp3" },
    { title: "غيرك سواك", artist: "Abdul Majeed Abdullah", src: "Abdul Majeed Abdullah - Ghairek Sowaak _ Lyrics Video 2025 _ عبد المجيد عبدالله - غيرك سواك(MP3_320K).mp3" },
    { title: "بلا ما نحس", artist: "Abeer Nehme", src: "Abeer Nehme - Bala Ma Nhess _ عبير نعمة - بلا ما نحس(MP3_320K).mp3" },
    { title: "بصراحة", artist: "Abeer Nehme", src: "Abeer Nehme - Bi Saraha _ عبير نعمة - بصراحة(MP3_320K).mp3" },
    { title: "لكل عاشق وطن", artist: "Abu Ali", src: "Abu Ali Song لكل عاشق وطن من فيلم أبو علي(MP3_320K).mp3" },
    { title: "ثلاث دقات", artist: "Abu Ft. Yousra", src: "Abu Ft. Yousra - 3 Daqat _ Official Music Video _ أبو و يسرا - ثلاث دقات(MP3_320K).mp3" },
    { title: "قلبي مرتاح", artist: "Adam", src: "Adam - Albi Mertah (Official Music Video) _ آدم - قلبي مرتاح(MP3_320K).mp3" },
    { title: "تعا", artist: "Adam", src: "Adam - Taa (Official Lyric Video) _ أدم - تعا(MP3_320K).mp3" },
    { title: "قادر اكمل", artist: "Ahmed Saad", src: "Ahmed Saad - Ader Akmel _ Official Lyrics Video - 2023 _ أحمد سعد - قادر اكمل(MP3_320K).mp3" },
    { title: "عليكي عيون", artist: "Ahmed Saad", src: "Ahmed Saad - Aleky Eyoun ( Full Version - 2022 ) احمد سعد - عليكي عيون(MP3_320K).mp3" },
    { title: "Akhedny ma3ak", artist: "Various Artists", src: "Akhedny ma3ak(MP3_320K).mp3" },
    { title: "حبيبي ملاك", artist: "Amr Diab", src: "Albumaty.Com_amrw_dyab_hbیbty_mlak.mp3" },
    { title: "ALBY MSALLEM", artist: "Various Artists", src: "ALBY MSALLEM(MP3_320K).mp3" },
    { title: "رجعت اضحك", artist: "Ali Leo", src: "Ali Leo – Rej3t Adhehk (Official Music Video) _علي ليو - رجعت اضحك (فيديو كليب) _2025(MP3_320K).mp3" },
    { title: "عوضني بيك", artist: "Ali Saber", src: "Ali Saber - Awadni Beek _ 2024 _ علي صابر - عوضني بيك(MP3_320K).mp3" },
    { title: "دعوة أمي", artist: "Ali Saber", src: "Ali Saber - Dawaat Ommi _ 2024 _ علي صابر - دعوة أمي _ البوم يراقبني(MP3_320K).mp3" },
    { title: "يراقبني", artist: "Ali Saber", src: "Ali Saber -Yeraqbni _ 2024 _ علي صابر - يراقبني  _ البوم يراقبني(MP3_320K).mp3" },
    { title: "Baba", artist: "Amr Diab", src: "Amr Diab - Baba.mp3" },
    { title: "Ebtadena", artist: "Amr Diab", src: "Amr Diab - Ebtadena.mp3" },
    { title: "Habibty Malak", artist: "Amr Diab", src: "Amr Diab - Habibty Malak.mp3" },
    { title: "هلونهم", artist: "Amr Diab", src: "Amr Diab - Halawwenhom (Official Lyric Video) _ (كلمات) عمرو دياب - ھلونھم(MP3_160K).mp3" },
    { title: "Khatfoony", artist: "Amr Diab", src: "Amr Diab - Khatfoony.mp3" },
    { title: "ما تقلقش", artist: "Amr Diab", src: "Amr Diab - Mate_laash (Official Lyric Video) _ (كلمات) عمرو دياب - ما تقلقش(MP3_320K).mp3" },
    { title: "Shaif Amar", artist: "Amr Diab", src: "Amr Diab - Shaif Amar.mp3" },
    { title: "Ya Bakhto", artist: "Amr Diab", src: "Amr Diab - Ya Bakhto.mp3" },
    { title: "كرمال الحب", artist: "Anas Tabash & Ghazal Ghrayeb", src: "Anas Tabash _ Ghazal Ghrayeb - Kermal Elhob _ أنس طباش وغزل غريب - كرمال الحب(MP3_320K).mp3" },
    { title: "حالة خاصة جدا", artist: "Angham", src: "Angham _ Hala Khasa Gedan - 2019 _ انغام _ حالة خاصة جدا - بالكلمات(MP3_320K).mp3" },
    { title: "شايفه فيك", artist: "Assala", src: "Assala - Shayfa Feek [Lyrics Video] 2022 _ أصالة - شايفه فيك(MP3_320K).mp3" },
    { title: "سبب فرحتي", artist: "Assala & Ahmed Saad", src: "Assala _ Ahmed Saad - Sabb Farhety _ أصالة وأحمد سعد - سبب فرحتي _ أغنية عيد الحب كاملة 2024(MP3_320K).mp3" },
    { title: "الحب الأبدي", artist: "Assala & Majid Al Mohandis", src: "Assala _ Majid Al Mohandis - Al Hob Al Abadi _ Video Clip 2023 _ ماجد المهندس وأصالة - الحب الأبدي(MP3_320K).mp3" },
    { title: "بحبك والله", artist: "Ayman Zbib", src: "Ayman Zbib ... Bahebak Walah _ ايمن زبيب ...  بحبك والله(MP3_320K).mp3" },
    { title: "انا من غيرك", artist: "Bahaa Sultan", src: "Bahaa Sultan - Ana Mn Gherak _ 2024 _ بهاء سلطان - انا من غيرك (من فيلم الهوى سلطان)(MP3_320K).mp3" },
    { title: "دبلوماسي", artist: "Balqees", src: "Balqees - Diplomacy (Official Music Video) _ بلقيس - دبلوماسي(MP3_320K).mp3" },
    { title: "يا هوى", artist: "Balqees Fathi", src: "Balqees Fathi - Ya Hawa (Official Music Video) _ بلقيس فتحي  - يا هوى (فيديو كليب)(MP3_320K).mp3" },
    { title: "نفس", artist: "Carole Samaha", src: "Carole Samaha - Nafas (Official Music Video) _ كارول سماحة - نفس(MP3_320K).mp3" },
    { title: "نبغيك", artist: "CRAVATA", src: "CRAVATA - NBGHIK (LE CHOIX) _ (Exclusive music video 2023) _ كرافاطا -  نبغيك(MP3_320K).mp3" },
    { title: "ع بالي حبيبي", artist: "Elissa", src: "Elissa - Aa Baly Habibi _ اليسا - ع بالي حبيبي(MP3_320K).mp3" },
    { title: "عيشالك", artist: "Elissa", src: "Elissa - Aayshalak (Official Clip) _ إليسا - عيشالك(MP3_320K).mp3" },
    { title: "أسعد واحدة", artist: "Elissa", src: "Elissa - As3ad Wahda Video Clip _ فيديو كليب إليسا - أسعد واحدة(MP3_320K).mp3" },
    { title: "بتمون", artist: "Elissa", src: "Elissa - Betmoun _ Official Music Video _ اليسا - بتمون(MP3_320K).mp3" },
    { title: "مكتوبة ليك", artist: "Elissa", src: "Elissa - Maktooba Leek _ Lyrics Video _ إليسا - مكتوبة ليك(MP3_320K).mp3" },
    { title: "سلملى عليه", artist: "Elissa", src: "Elissa - Salimli Aleh (Audio) _ اليسا - سلملى عليه(MP3_320K).mp3" },
    { title: "نفسي أقوله", artist: "Elissa", src: "Elissa ... Nefsi Aollo - 2018 _ إليسا ... نفسي أقوله - بالكلمات(MP3_320K).mp3" },
    { title: "لو تعرفوه", artist: "Elissa", src: "Elissa Law Tearafou اليسا - لو تعرفوه(MP3_320K).mp3" },
    { title: "بستناك", artist: "Elissa", src: "Elissa _ Bastanak - Video Clip _ إليسا _ بستناك - فيديو كليب(MP3_320K).mp3" },
    { title: "من أول دقيقة", artist: "Elissa & Saad Lamjarred", src: "Elissa _ Saad Lamjarred - Min Awel Dekika [Official Video] (2022) _ اليسا وسعد لمجرد - من أول دقيقة(MP3_320K).mp3" },
    { title: "Al Kawn Janni Maak", artist: "Elyanna", src: "Elyanna - Al Kawn Janni Maak (Official Video)(MP3_320K).mp3" },
    { title: "حلمي وحلمك", artist: "Eyad Tannous", src: "Eyad Tannous - Helmi W Helmik [Official Lyric Video] (2022) _ اياد طنوس - حلمي وحلمك(MP3_320K).mp3" },
    { title: "طلت الشتوية", artist: "Fadel Chaker", src: "Fadel Chaker  - Talet El Chatwieh _ فضل شاكر - طلت الشتوية _ 2025(MP3_320K).mp3" },
    { title: "أحلى رسمه", artist: "Fadel Chaker", src: "Fadel Chaker - Ahla Rasma  _ 2025 _ فضل شاكر - أحلى رسمه(MP3_320K).mp3" },
    { title: "بتوحشيني", artist: "Fadel Chaker", src: "Fadel Chaker - Btwhashenni (Official Lyrics Video) _  فضل شاكر - بتوحشيني(MP3_320K).mp3" },
    { title: "حبيتك", artist: "Fadel Chaker", src: "Fadel Chaker - Habetak _ فضل شاكر - حبيتك(MP3_320K).mp3" },
    { title: "معقول", artist: "Fadel Chaker", src: "Fadel Chaker - Maaol (Exclusive Lyrics Video) _ فضل شاكر - معقول(MP3_320K).mp3" },
    { title: "صحاك الشوق", artist: "Fadel Chaker", src: "Fadel Chaker - Sahak Isho2  _ 2025 _ فضل شاكر - صحاك الشوق(MP3_320K).mp3" },
    { title: "لو على قلبي", artist: "Fadl Shaker", src: "Fadl Shaker - Law Ala Albi _ Official Music Video _ فضل شاكر - لو على قلبي(MP3_320K).mp3" },
    { title: "مليون شاعر", artist: "Ghazal Ghrayeb", src: "Ghazal Ghrayeb - Million sha3er _ غزل غريّب - مليون شاعر(MP3_320K).mp3" },
    { title: "بقيت معاه", artist: "Hamaki", src: "Hamaki - Baeit Maah (Official Lyric Video) _ حماقي - بقيت معاه - كلمات(MP3_320K).mp3" },
    { title: "مش قادر أنسى", artist: "Hamaki", src: "Hamaki - Mesh Aader Ansa _ حماقي - مش قادر أنسى(MP3_320K).mp3" },
    { title: "قدام الناس", artist: "Hamaki", src: "Hamaki - Oddam El Nas (Official Lyric Video) _ حماقي - قدام الناس - كلمات(MP3_320K).mp3" },
    { title: "راسمك في خيالي", artist: "Hamaki", src: "Hamaki - Rasmak Fi Khayali Clip _ حماقي - كليب راسمك في خيالي(MP3_320K).mp3" },
    { title: "تك", artist: "Hamaki", src: "Hamaki - Tak _ حماقي - تك(MP3_320K).mp3" },
    { title: "يا ستّار", artist: "Hamaki", src: "Hamaki - Ya Sattar (Official Lyric Video) _ حماقي - يا ستّار - كلمات(MP3_320K).mp3" },
    { title: "اعظم انجازاتى", artist: "Haneen", src: "Haneen - A3zam Engazaty _ Official Lyrics Video - 2024 _ حنين - اعظم انجازاتى(MP3_320K).mp3" },
    { title: "بسيكولوغ", artist: "Hatim Ammor", src: "Hatim Ammor - Psychologue [Official Music Video] (2024) _ حاتم عمور - بسيكولوغ(MP3_320K).mp3" },
    { title: "HELEF EL AMAR", artist: "Georges Wassouf", src: "HELEF EL AMAR - Georges Wassouf(MP3_320K).mp3" },
    { title: "بحبك وحشتيني", artist: "Husain Al Jassmi", src: "Husain Al Jassmi ... Bahebik Wahchtini _ حسين الجسمي ... بحبك وحشتيني(MP3_320K).mp3" },
    { title: "فستانك الأبيض", artist: "Hussain Al Jassmi", src: "Hussain Al Jassmi - Fostanek Al Abyad _2025_حسين الجسمي - فستانك الأبيض - زفاف هشام جمال وليلى زاهر(MP3_320K).mp3" },
    { title: "معك عالموت", artist: "Hussein Al Deek", src: "Hussein Al Deek - Ma_ik Aala Almot [Music Video] (2018) _ حسين الديك - معك عالموت(MP3_320K).mp3" },
    { title: "Hadal Ahbek", artist: "Issam Alnajjar", src: "Issam Alnajjar - Hadal Ahbek (Performance Video)(MP3_320K).mp3" },
    { title: "الحب عفوي", artist: "Joseph Attieh", src: "Joseph Attieh - El Hobb Aafawi [Official Music Video] (2022) _ جوزيف عطية - الحب عفوي(MP3_320K).mp3" },
    { title: "عمرعسل", artist: "Joseph Attieh", src: "Joseph Attieh - Omer Aasal  [Official Music Video] (2018) _  جوزيف عطية - عمرعسل(MP3_320K).mp3" },
    { title: "Kol Maghanni", artist: "Various Artists", src: "Kol Maghanni(MP3_320K).mp3" },
    { title: "أول حب", artist: "Maha Ftouni", src: "Maha Ftouni - Awel Hob (Official Lyric Video) _ مهى فتوني - أول حب(MP3_320K).mp3" },
    { title: "عيونا", artist: "Mahfoud Almaher", src: "Mahfoud Almaher - 3youna (Official Music Video) _ محفوض الماهر - عيونا(MP3_320K).mp3" },
    { title: "جننت قلبي", artist: "Majid Al Mohandis", src: "Majid Al Mohandis - Janant Galbi _ Lyrics Video 2023 _ ماجد المهندس - جننت قلبي(MP3_320K).mp3" },
    { title: "اوكسجين", artist: "Majid Al Mohandis", src: "Majid Al Mohandis ... Oxygen - 2022 _ ماجد المهندس ... اوكسجين(MP3_320K).mp3" },
    { title: "كلمات", artist: "Majida El Roumi", src: "Majida El Roumi - Kalimat _ ماجدة الرومي - كلمات(MP3_320K).mp3" },
    { title: "كل القصايد", artist: "Marwan Khoury", src: "Marwan Khoury - Kol El Qassayed _ Official Music Video _ مروان خوري - كل القصايد(MP3_320K).mp3" },
    { title: "تدري ناسيك", artist: "Mawj", src: "Mawj – Tedri Naseek _ موج - تدري ناسيك (Official Music Video)(MP3_320K).mp3" },
    { title: "El Hob El Hob", artist: "Mohamed El Majzoub", src: "Mohamed El Majzoub - El Hob El Hob(MP3_320K).mp3" },
    { title: "الذوق العالي", artist: "Mohamed Mounir & Tamer Hosny", src: "Mohamed Mounir FT Tamer Hosny - El zouA El Aaly ( Music Video) محمد منير وتامر حسني - الذوق العالي(MP3_160K).mp3" },
    { title: "Fi Ishk El Banat", artist: "Mohamed Mounir", src: "Mohamed_Mounir_Fi_Ishk_El_Banat.mp3" },
    { title: "بالحب منوقع", artist: "Mohammed Assaf", src: "Mohammed Assaf - Belhob Mnou2a3 _ محمد عساف بالحب منوقع(MP3_320K).mp3" },
    { title: "قالوا عليكي", artist: "Mohammed Saeed", src: "Mohammed Saeed - 2alo 3aleky _ محمد سعيد - قالوا عليكي ( Official Audio )(MP3_320K).mp3" },
    { title: "لكيته", artist: "Nabeel Aladeeb", src: "Nabeel Aladeeb – Lekyta (Video) _نبيل الاديب بمشاركة هدى عادل ويوسف مازن - لكيته (فيديو) _2025(MP3_320K).mp3" },
    { title: "بدي حدا حبو", artist: "Nancy Ajram", src: "Nancy Ajram - Baddi Hada Hebbou (Official Music Video) _ نانسي عجرم - بدي حدا حبو(MP3_320K).mp3" },
    { title: "اللي كان", artist: "Nancy Ajram", src: "Nancy Ajram - Elly Kan (Official Music Video) _ نانسي عجرم - اللي كان(MP3_320K).mp3" },
    { title: "لون عيونك", artist: "Nancy Ajram", src: "Nancy Ajram - Lawn Oyounak (Official Music Video) _ نانسي عجرم - لون عيونك(MP3_320K).mp3" },
    { title: "ما تيجي هنا", artist: "Nancy Ajram", src: "Nancy Ajram - Ma Tegi Hena - (Official Music Video) _ نانسي عجرم - ما تيجي هنا(MP3_320K).mp3" },
    { title: "سلامات", artist: "Nancy Ajram", src: "Nancy Ajram - Salamat (Official Music Video) _ نانسي عجرم - سلامات (فيديو كليب)(MP3_320K).mp3" },
    { title: "جانت ايام", artist: "Naser Al Bahar", src: "Naser Al Bahar - Jant Ayam (Official Lyric Video) _2025_ نصر البحار - جانت ايام (اوديو حصري)(MP3_320K).mp3" },
    { title: "ما تنضمن", artist: "Naser Al Bahar", src: "Naser Al Bahar - Ma Tendhmn (Official Audio) _2023_ نصر البحار - ما تنضمن (اوديو حصري)(MP3_320K).mp3" },
    { title: "بالأحلام", artist: "Nassif Zeytoun", src: "Nassif Zeytoun - Bel Ahlam [Official Music Video] (2022) _ ناصيف زيتون - بالأحلام(MP3_320K).mp3" },
    { title: "ومعاك", artist: "Nedaa Shrara", src: "Nedaa Shrara - W Ma_aak [Official Video] (2023) _ نداء شرارة - ومعاك(MP3_320K).mp3" },
    { title: "Jilali", artist: "Nouaman Belaiachi", src: "Nouaman Belaiachi - Jilali [Official Music Video](MP3_320K).mp3" },
    { title: "ما عاد تسال", artist: "Rabeh Saqer", src: "Rabeh Saqer - Ma A_d Tesa_l _ ليلة الصقر 2024 _ رابح صقر - ما عاد تسال(MP3_320K).mp3" },
    { title: "قلبي عشقها", artist: "Ragheb Alama", src: "Ragheb Alama - Albi Ashe2ha (remake version) - راغب علامة - قلبي عشقها(MP3_320K).mp3" },
    { title: "اشتقتلك انا", artist: "Ragheb Alama", src: "Ragheb Alama - Eshtaatelak Ana _ راغب علامه - اشتقتلك انا(MP3_320K).mp3" },
    { title: "شو عامل فيي", artist: "Ragheb Alama", src: "Ragheb Alama - Shu Aamel Fiyyi (Official Music Video) _ راغب علامة  - شو عامل فيي(MP3_320K).mp3" },
    { title: "الكوكب", artist: "Rahma Riad", src: "Rahma Riad - Al Kawkab [Official Lyric Video] (2021) _ رحمة رياض - الكوكب(MP3_320K).mp3" },
    { title: "حلو هالشعور", artist: "Rahma Riad", src: "Rahma Riad - Helo Hal Shuur [Official Music Video] (2023) _ رحمة رياض - حلو هالشعور(MP3_320K).mp3" },
    { title: "قلبى مال", artist: "Ramy Ayach", src: "Ramy Ayach - Albi Mal -  رامى عياش - قلبى مال(MP3_320K).mp3" },
    { title: "قصة حب", artist: "Ramy Ayach", src: "Ramy Ayach - Qesset Hob ( Exclusive Music Video ) _ 2019 _ رامى عياش - قصة حب(MP3_320K).mp3" },
    { title: "عاملة ايه", artist: "Ramy Gamal", src: "Ramy Gamal - 3amla eh [ Official lyrics video ] _ رامي جمال - عاملة  ايه(MP3_320K).mp3" },
    { title: "بحكي عليكي", artist: "Ramy Sabry", src: "Ramy Sabry - Bahki Aleky [Official Lyrics Video] _ رامي صبري - بحكي عليكي(MP3_320K).mp3" },
    { title: "عيونه لما قابلوني", artist: "Ramy Sabry", src: "Ramy Sabry - Oyouno Lama Ablony [ Official Lyrics Video] _ رامي صبري - عيونه لما قابلوني(MP3_320K).mp3" },
    { title: "خيول الذكريات", artist: "Rashed Al Majed", src: "Rashed Al Majed - KHOYOUL ALTHIKRAYAT _ 2023 _ راشد الماجد – خيول الذكريات ( حصرياً )(MP3_320K).mp3" },
    { title: "نصي الأجمل", artist: "Rashed Al Majid", src: "Rashed Al Majid - Nosy AL Ajmal _ Lyrics Video 2024 _ راشد الماجد - نصي الأجمل(MP3_320K).mp3" },
    { title: "عدى الكلام", artist: "Saad Lamjarred", src: "Saad Lamjarred - ADDA ELKALAM (EXCLUSIVE Music Video) _ 2020 _ (سعد لمجرد - عدى الكلام (فيديو كليب(MP3_320K).mp3" },
    { title: "العاشق الهايم", artist: "Saad Lamjarred", src: "Saad Lamjarred - Alacheq Alhayem _ 2022 _ سعد لمجرد  - العاشق الهايم(MP3_320K).mp3" },
    { title: "عشك موت", artist: "Saif Nabeel", src: "Saif Nabeel - Ashq Mot (Official Music Video) _ سيف نبيل - عشك موت - الكليب الرسمي(MP3_320K).mp3" },
    { title: "بحبك من زمان", artist: "Sherine", src: "Sherine - Bahebak Men Zaman _ شيرين - بحبك من زمان(MP3_320K).mp3" },
    { title: "حبه جنة", artist: "Sherine", src: "Sherine - Hobbo Ganna _ شيرين - حبه جنة(MP3_320K).mp3" },
    { title: "كلي ملكك", artist: "Sherine", src: "Sherine - Kolly Melkak (Official Music Video) _ شيرين - كلي ملكك - الكليب الرسمي(MP3_320K).mp3" },
    { title: "يا ليالي", artist: "Sherine", src: "Sherine - Ya Layaly (Official Lyric Video) _ شيرين - يا ليالي - كلمات(MP3_320K).mp3" },
    { title: "عشانك", artist: "Siilawy", src: "Siilawy - عشانك (Official Lyric Video)(MP3_320K).mp3" },
    { title: "عشاني", artist: "Siilawy", src: "Siilawy - عشاني (Official Music Video)(MP3_320K).mp3" },
    { title: "لما تكوني", artist: "Siilawy", src: "Siilawy - لما تكوني (Official Music Video)(MP3_320K).mp3" },
    { title: "راحت أيامه", artist: "Sultan Al Murshed", src: "Sultan Al Murshed - Rahet Ayamoh (2025 Album) _ سلطان المرشد - راحت أيامه (من ألبوم ٢٠٢٥)(MP3_320K).mp3" },
    { title: "حبك رزق", artist: "Tamer Ashour", src: "Tamer Ashour - 7obk Rezk _ تامر عاشور - حبك رزق(MP3_320K).mp3" },
    { title: "خليني في حضنك", artist: "Tamer Ashour", src: "Tamer Ashour - Khaleeny Fi Hodnak _ تامر عاشور - خليني في حضنك(MP3_320K).mp3" },
    { title: "خلتني احس", artist: "Tamer Ashour", src: "Tamer Ashour - Khaletni Ahes _ تامر عاشور - خلتني احس(MP3_320K).mp3" },
    { title: "مكرهتوش", artist: "Tamer Ashour", src: "Tamer Ashour - Makrehtosh _ ‎تامر عاشور - مكرهتوش(MP3_160K).mp3" },
    { title: "قصر بعيد", artist: "Tamer Ashour", src: "Tamer Ashour - Qasr B3eed _ تامر عاشور - قصر بعيد(MP3_320K).mp3" },
    { title: "ياه", artist: "Tamer Ashour", src: "Tamer Ashour - Yaah _  ‎تامر عاشور - ياه(MP3_160K).mp3" },
    { title: "يا واحشني", artist: "Tamer Hosny", src: "Tamer Hosny - Ya Waheshny _ Official Music Video _ تامر حسنى - يا واحشني(MP3_320K).mp3" },
    { title: "ملكة جمال الكون", artist: "Tamer Hosny & Al Shami", src: "Tamer Hosny _ Al Shami - Maleket Gamal El Kon (Official Video) _ تامر حسني والشامي - ملكة جمال الكون(MP3_160K).mp3" },
    { title: "المقص", artist: "Tamer Hosny & Reda El Bahrawy", src: "Tamer Hosny _ Reda El Bahrawy - El Ma2as _ (تامر حسني ورضا البحراوي - المقص (من البوم لينا معاد(MP3_160K).mp3" },
    { title: "Maleket Gamal El Kon", artist: "Tamer Hosny & Al Shami", src: "Tamer_Hosny_Al_Shami_Maleket_Gamal_El_Kon_Official_Video_تام.mp3" },
    { title: "قسم الشكاوي", artist: "TUL8TE", src: "TUL8TE - QESM EL SHAKAWY _ توو ليت - قسم الشكاوي(MP3_160K).mp3" },
    { title: "ايه كمان", artist: "TURK", src: "TURK - EH KMAN ايه كمان [Original Clip_ prod. Big Moe](MP3_320K).mp3" },
    { title: "كل وعد", artist: "Wael Jassar", src: "Wael Jassar - Koul Waad [ Official Video Clip ] _ وائل جسار - كل وعد(MP3_320K).mp3" },
    { title: "البنت القوية", artist: "Wael Kfoury", src: "Wael Kfoury - El Bint El Awiye ( Music Video - 2021) وائل كفوري - البنت القوية(MP3_320K).mp3" },
    { title: "الوقت هدية", artist: "Wael Kfoury", src: "Wael Kfoury - El Waet Hdiye ( Official Music Video 2024 ) _ وائل كفوري - الوقت هدية(MP3_320K).mp3" },
    { title: "ست الكل", artist: "Wael Kfoury", src: "Wael Kfoury - Set El Kel ( Music Video - 2022) وائل كفوري - ست الكل(MP3_320K).mp3" },
    { title: "بحبك انا كتير", artist: "Wael Kfoury", src: "Wael Kfoury Bahebak Ana Ktear وائل كفورى - بحبك انا كتير(MP3_320K).mp3" },
    { title: "يا بتفكر يا بتحس", artist: "Various Artists", src: "Ya Betfaker Ya Bet7es _ يا بتفكر يا بتحس(MP3_320K).mp3" },
    { title: "ما بعرف", artist: "Yara", src: "Yara - Ma Baaref [Official Music Video] (2015) _ يارا - ما بعرف(MP3_320K).mp3" },
    { title: "هيدي حبيبة قلبي", artist: "Ziad Bourji", src: "Ziad Bourji  - Haydi Habibit Albi [Official Music Video] (2022) _ زياد برجي - هيدي حبيبة قلبي(MP3_320K).mp3" },
    { title: "أنا وياك", artist: "Ziad Bourji", src: "Ziad Bourji - Ana Weyak [Music Video] (2020) _ زياد برجي - أنا وياك(MP3_320K).mp3" },
    { title: "قاعد على قلبك", artist: "Ziad Bourji", src: "Ziad Bourji - A_ed Aala Albak _ زياد برجي - قاعد على قلبك(MP3_320K).mp3" },
    { title: "شو حلو", artist: "Ziad Bourji", src: "Ziad Bourji - Shou Helou [Music Video] _ زياد برجي -  شو حلو (فيلم  بالغلط)(MP3_320K).mp3" },
    { title: "وبطير", artist: "Ziad Bourji", src: "Ziad Bourji - W Btir [Official Music Video] (2022) _ زياد برجي - وبطير(MP3_320K).mp3" },
    { title: "Follow", artist: "Zouhair Bahaoui & Hind Ziadi", src: "Zouhair Bahaoui Ft Hind Ziadi - Follow (EXCLUSIVE Music Video)(MP3_320K).mp3" },
    { title: "سر الحياة", artist: "Aseel Hameem", src: "أصيل هميم - سر الحياة _ 2019 _ Aseel Hameem - Ser Alhayah(MP3_320K).mp3" },
    { title: "كريزة شوق", artist: "Anas Kareem", src: "أنس كريم - كريزة شوق Anas Kareem - Krezit Shawk (Official Lyric Video)(MP3_320K).mp3" },
    { title: "احبك من الصفر", artist: "Ismail Mubarak & Aseel Hameem", src: "إسماعيل مبارك واصيل هميم - احبك من الصفر (حصرياً) _ 2022(MP3_320K).mp3" },
    { title: "اخيراً قالها", artist: "Ahmed Al Moslawy", src: "احمد المصلاوي   اخيراً قالها  فيديو كليب حصري(MP3_320K).mp3" },
    { title: "انت اختيار", artist: "Tamer Hosny", src: "اغنية انت اختيار - تامر حسني من فيلم بحبك _ Tamer Hosny Enta Ekhtyar(MP3_320K).mp3" },
    { title: "بحبك", artist: "Tamer Hosny", src: "اغنية بحبك - تامر حسني من فيلم _مش انا __Tamer Hosny - Bahbek(MP3_320K).mp3" },
    { title: "ياما نفسي اقولك", artist: "Donia Samir Ghanem", src: "اغنية ياما نفسي اقولك - دنيا سمير غانم _ من مسلسل _عايشة_الدور(MP3_320K).mp3" },
    { title: "برضه بتوحشني", artist: "Angham & Wael Kfoury", src: "انغام ووائل كفورى - برضه بتوحشني _2021 _ Angham _ Wael Kfoury - bardo btw7ashniy(MP3_320K).mp3" },
    { title: "هاخد نفسي وادلعني", artist: "Yara Mohamed", src: "بهوايا بهوايا ( هاخد نفسي وادلعني ) يارا محمد الملكة [ الفيديو كليب الرسمي ] انتاج اب(MP3_32.mp3" },
    { title: "دي لعبالي في دماغي", artist: "TUL8TE", src: "توو ليت - مهرجان دي لعبالي في دماغي ( النسخة الديمو )(MP3_320K).mp3" },
    { title: "تكبر فرحتي بعيني", artist: "Hussam AL-Rassam", src: "حسام الرسام - تكبر فرحتي بعيني _ Hussam AL-Rassam - Tekbar Farehti bi Aayni 2025(MP3_320K).mp3" },
    { title: "بالبنط العريض", artist: "Hussain Al Jassmi", src: "حسين الجسمي -  بالبنط العريض (حصرياً) _ 2020(MP3_320K).mp3" },
    { title: "حته من قلبي", artist: "Hussain Al Jassmi", src: "حسين الجسمي -  حته من قلبي (حصرياً) _ 2021 _ Hussain Al Jassmi - Piece Of My Heart(MP3_320K).mp3" },
    { title: "فستانك الأبيض", artist: "Hussain Al Jassmi", src: "حسين الجسمي -  فستانك الأبيض _ 2025(MP3_320K).mp3" },
    { title: "الشبكة واقعة ولا ايه", artist: "Essam Sasa", src: "رقم واحد مايشغلوش ( الشبكة واقعة ولا ايه ) عصام صاصا الكروان - توزيع كيمو الديب Official V(MP3_3.mp3" },
    { title: "صاير", artist: "Noor Alzain", src: "صاير- من البوم الفنان - نور الزين 2025 _ Noor Alzain(MP3_320K).mp3" },
    { title: "بحبك", artist: "Omar Kamal", src: "عمر كمال _ بحبك _ هدية أحمد العوضى لياسمين عبد العزيز ف عيد ميلادها ❤️(MP3_320K).mp3" },
    { title: "تحبيني", artist: "Ghaith Sabah", src: "غيث صباح - تحبيني(كمر ونجماته عيونج) __ Ghaith Sabah - THBENE(MP3_320K).mp3" },
    { title: "الحب الكبير", artist: "Fouad Abdulwahed", src: "فؤاد عبدالواحد - الحب الكبير (حصرياً) _ 2022 _ Fouad Abdulwahed - Alhob Alkbeer(MP3_320K).mp3" },
    { title: "عيد العشاق", artist: "Kadim Al Sahir", src: "كاظم الساهر- عيد العشاق _ Kadim Al Sahir - Eid Al Ashaq(MP3_320K).mp3" },
    { title: "عيونها بلاد", artist: "Yahia Alaa", src: "كليب اغنية - عيونها بلاد - يحيي علاء ( 2024 ) • [Ayonha Blad - Yahia Alaa [Official Music Video(MP3_320K).mp3" },
    { title: "و أخيراً", artist: "Tamer Hosny", src: "كليب اغنية و أخيراً - تامر حسني - من فيلم البدلة _ W Akheran - Tamer Hosny From ElBadla(MP3_320K).mp3" },
    { title: "ما تيجي نركن الزعل", artist: "Lil Elmohamedy", src: "ما تيجي نركن الزعل - ليل المحمدي - ( البوم عشوائي 1 ) _ Lil Elmohamedy - Ma Tigy Nerkn Elzaal(MP3_160K).mp3" },
    { title: "الحب القوي", artist: "Mohammed Al Shehhi", src: "محمد الشحي - الحب القوي (حصريآ) _ 2019(MP3_320K).mp3" },
    { title: "يانجمة", artist: "Mohammed Abd Aljabar", src: "محمد عبد الجبار - يانجمة _ Mohammed Abd Aljabar - Ya Najmah(MP3_320K).mp3" },
    { title: "قلب على الورقه نرسم", artist: "Mohammed Abd Aljabar & Mustafa Al Rubaie", src: "محمد عبد الجبار و مصطفى الربيعي - قلب على الورقه نرسم ( حصريا ) _ 2025(MP3_320K).mp3" },
    { title: "بين قوسين", artist: "Mahmood Aturky & Aseel Hameem", src: "محمود التركي و اصيل هميم - بين قوسين ( حصريا ) _ 2021 _ Mahmood Aturky Ft Aseel Hameem(MP3_320K).mp3" },
    { title: "مدرسة الحب", artist: "Marwan Khoury", src: "مروان خوري - مدرسة الحب _ (Marwan khoury - Madraset Elhobb (lyrics(MP3_320K).mp3" },
    { title: "مش قادر اعيش", artist: "Yahia Alaa", src: "مش قادر اعيش - يحيي علاء ( الإصدار الرسمي ) 2024(MP3_320K).mp3" },
    { title: "عالم خبيثه", artist: "Various Artists", src: "مهرجان _ عالم خبيثه _(MP3_320K).mp3" },
    { title: "نخبي ليه", artist: "Wael Jassar", src: "وائل جسار - نخبي ليه - من فيلم 365 يوم سعادة(MP3_320K).mp3" },
    { title: "ياحور عيني", artist: "Amin Khattab", src: "يا جميلتي يا اميرتي ( ياحور عيني قد اكتفيت من العذاب ) امين خطاب - توزيع اسلام فتحي ان(MP3_3.mp3" },
    { title: "ياما ليالي وانت مش معايا", artist: "Various Artists", src: "ياما ليالي وانت مش معايا(MP3_320K).mp3" },
    { title: "يا غصن بان", artist: "Yahia Alaa", src: "ڤيديو كليب يا غصن بان - يحيي علاء _ Ya 8osn Ban - Yahia Alaa ( Music Video Clip )(MP3_320K).mp3" }
];

function initMusicPlayer() {
    audioPlayer = document.getElementById('audio-player');
    
    // Set initial volume
    audioPlayer.volume = 0.7;
    
    // Update progress bar
    audioPlayer.addEventListener('timeupdate', updateProgress);
    
    // Handle audio end
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 'one') {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            nextSong();
        }
    });
    
    // Handle audio load
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
    
    // Set initial song
    loadSong(currentSongIndex);
}

function loadSong(index) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        const song = songs[index];
        
        // Update audio source
        audioPlayer.src = song.src;
        
        // Update UI
        document.getElementById('current-song-title').textContent = song.title;
        document.getElementById('current-song-artist').textContent = song.artist;
        
        // Update playlist active state
        updatePlaylistActiveState();
        
        // Reset progress
        document.getElementById('progress').style.width = '0%';
        document.getElementById('current-time').textContent = '0:00';
        document.getElementById('total-time').textContent = '0:00';
    }
}

function selectSong(index) {
    loadSong(index);
    if (isPlaying) {
        audioPlayer.play().catch(e => {
            console.log('Audio play failed:', e);
            alert('Click anywhere on the page first to enable audio, then try again!');
        });
    }
}

function toggleMusic() {
    const albumArt = document.querySelector('.album-art');
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        if (albumArt) albumArt.classList.remove('playing');
    } else {
        audioPlayer.play().catch(e => {
            console.log('Audio play failed:', e);
            alert('Click anywhere on the page first to enable audio, then try again!');
        });
        isPlaying = true;
        if (albumArt) albumArt.classList.add('playing');
    }
    updatePlayButton();
}

function previousSong() {
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    loadSong(newIndex);
    if (isPlaying) {
        audioPlayer.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }
}

function nextSong() {
    let newIndex;
    if (isShuffle) {
        newIndex = Math.floor(Math.random() * songs.length);
    } else {
        newIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    }
    loadSong(newIndex);
    if (isPlaying) {
        audioPlayer.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }
}

function updatePlayButton() {
    const playIcon = document.getElementById('play-icon');
    if (isPlaying) {
        playIcon.className = 'fas fa-pause';
    } else {
        playIcon.className = 'fas fa-play';
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('current-time');
    
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = progressPercent + '%';
        
        // Update time display
        const minutes = Math.floor(audioPlayer.currentTime / 60);
        const seconds = Math.floor(audioPlayer.currentTime % 60);
        currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateTotalTime() {
    const totalTime = document.getElementById('total-time');
    if (audioPlayer.duration) {
        const minutes = Math.floor(audioPlayer.duration / 60);
        const seconds = Math.floor(audioPlayer.duration % 60);
        totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function seekTo(event) {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    if (audioPlayer.duration) {
        audioPlayer.currentTime = audioPlayer.duration * percentage;
    }
}

function updatePlaylistActiveState() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Volume control
function changeVolume(value) {
    if (audioPlayer) {
        audioPlayer.volume = value / 100;
    }
}

// Shuffle control
function toggleShuffle() {
    isShuffle = !isShuffle;
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (isShuffle) {
        shuffleBtn.classList.add('active');
    } else {
        shuffleBtn.classList.remove('active');
    }
}

// Repeat control
function toggleRepeat() {
    const repeatBtn = document.getElementById('repeat-btn');
    if (repeatMode === 'none') {
        repeatMode = 'all';
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
    } else {
        repeatMode = 'none';
        repeatBtn.classList.remove('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    }
}

// Playlist search
function searchPlaylist() {
    const searchInput = document.getElementById('playlist-search');
    const filter = searchInput.value.toLowerCase();
    const playlistContainer = document.getElementById('playlist-container');
    const playlistItems = playlistContainer.querySelectorAll('.playlist-item');
    
    playlistItems.forEach((item, index) => {
        const songTitle = songs[index].title.toLowerCase();
        const songArtist = songs[index].artist.toLowerCase();
        
        if (songTitle.includes(filter) || songArtist.includes(filter)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Surprises functionality
const loveMessages = [
    "You are the sunshine that brightens my darkest days. I love you more than words can express! 💕",
    "Every moment with you feels like a beautiful dream. You are my heart, my soul, my everything. ❤️",
    "In your eyes, I found my home. In your heart, I found my peace. I love you beyond measure. 🌹",
    "You are not just my girlfriend, you are my best friend, my soulmate, my forever. I love you! 💖",
    "Every day I fall in love with you all over again. You are the most beautiful person I know. ✨",
    "Your smile is my favorite thing in the world. It lights up my life and fills my heart with joy. 😊",
    "I am so grateful to have you in my life. You make everything better just by being you. 💝",
    "You are the reason I believe in love, in forever, in us. I love you with all my heart. 💕",
    "No matter where life takes us, my heart will always belong to you. Forever and always. 💖",
    "You are my greatest adventure, my biggest dream, and my most beautiful reality. I love you! 🌟",
    "Every love song reminds me of you. Every romantic movie makes me think of us. You are my everything. 🎵",
    "I love the way you laugh, the way you care, the way you love. You are perfect to me. 💕",
    "You are my today and all of my tomorrows. I love you more than yesterday, less than tomorrow. ❤️",
    "In a world full of people, you are my favorite person. I love you beyond the stars. ⭐",
    "You are the missing piece I never knew I needed. You complete me in every way. 💖"
];

function showSurprise() {
    const surpriseText = document.getElementById('surprise-text');
    const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    
    // Add fade out effect
    surpriseText.style.opacity = '0';
    
    setTimeout(() => {
        surpriseText.textContent = randomMessage;
        surpriseText.style.opacity = '1';
    }, 300);
}

// Gallery functionality
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Add click animation
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
}

// Floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('i');
    heart.className = 'fas fa-heart';
    heart.style.position = 'fixed';
    heart.style.color = '#ffb6c1';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';
    heart.style.opacity = '0.8';
    
    document.body.appendChild(heart);
    
    // Animate heart floating up
    const animation = heart.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 0.8 },
        { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: 3000,
        easing: 'ease-out'
    });
    
    animation.addEventListener('finish', () => {
        heart.remove();
    });
}

// Add floating hearts on click
function initFloatingHearts() {
    document.addEventListener('click', (e) => {
        // Don't create hearts on navigation clicks
        if (e.target.closest('.nav-link') || e.target.closest('.hamburger')) {
            return;
        }
        
        // Create 2-3 hearts
        const heartCount = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => createFloatingHeart(), i * 200);
        }
    });
}

// Smooth scroll for scroll indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            showSection('story');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLoveCounter();
    initMusicPlayer();
    initGallery();
    initFloatingHearts();
    initScrollIndicator();
    
    // Show home section by default
    showSection('home');
    
    // Add some initial floating hearts
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createFloatingHeart(), i * 1000);
        }
    }, 2000);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Update counter display if needed
    if (counterInterval) {
        updateCounter();
    }
});

// Add some romantic background effects
function addRomanticEffects() {
    // Add subtle background animation
    document.body.style.background = `
        radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 192, 203, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 50%, #ffe4e1 100%)
    `;
}

// Initialize romantic effects
addRomanticEffects();
