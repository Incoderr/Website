const video = document.querySelector('#videopl');
const videopl = document.getElementById('videopl');
document.querySelector('#PlayPause').onclick = PlayPause;
var bigPlayButton = document.getElementById('BigPlayPause');
document.querySelector('#VolumeButton').addEventListener('click', toggleVolume);
document.querySelector('#VolumeSlider').oninput = VolumeSlider;
document.querySelector('#BigPlayPause').onclick = BigPlayPause;
document.querySelector('#PiP').onclick = PiP;
document.querySelector('#Fullscreen').onclick = Fullscreen;
document.querySelector('#currentTime').onclick = currentTime;
document.querySelector('#duration').onclick = duration;
document.querySelector('#timelineContainer').onclick = timelineContainer;
document.querySelector('#progressBar').onclick = progressBar;
const qualityButton = document.getElementById('qualityButton');
const qualityOptions = document.getElementById('qualityOptions');
const qualityList = document.getElementById('qualityList');
const volumeSlider = document.getElementById('VolumeSlider');
const control = document.getElementById('control');
const videoplayer = document.getElementById('video-player')



let isDragging = false;
let isDraggingVolume = false;
let isMouseMoving = false;
let inactivityTimeout;
let isMuted = false;
var isBigPlayPressed = false;

const playHtml = 'icon/play-fill.svg';
const pauseHtml = 'icon/pause-fill.svg';
const volumeOnHtml = 'icon/volume-up-fill.svg';
const volumeOffHtml = 'icon/volume-off-fill.svg';
const volumeUpHtml = 'icon/volume-up-fill.svg';
const volumeDownHtml = 'icon/volume-down-fill.svg';
const volumeMuteHtml = 'icon/volume-mute-fill.svg';


//кнопка паузы
function PlayPause() {
    const playIcon = document.querySelector('#PlayPause img');
    if (video.paused) {
        video.play();
        playIcon.src = pauseHtml;
    } else {
        video.pause();
        playIcon.src = playHtml;
    }
}
//пауза по плееру
video.addEventListener('click', () => {
    PlayPause(); 
});
//кнопка звука и ползунок
// Кнопка звука
function toggleVolume() {
    const volumeIcon = document.querySelector('#VolumeButton img');
    if (video.muted) {
        video.muted = false; // Включаем звук
        document.querySelector('#VolumeSlider').value = 1; // Ползунок на 1
        updateVolumeIcon(1); // Обновляем иконку звука
    } else {
        video.muted = true; // Выключаем звук
        document.querySelector('#VolumeSlider').value = 0; // Ползунок на 0
        updateVolumeIcon(0); // Обновляем иконку звука
    }
}

function VolumeSlider() {
    const volume = document.querySelector('#VolumeSlider').value;
    video.volume = volume;
    updateVolumeIcon(volume);
}

function updateVolumeIcon(volume) {
    const volumeIcon = document.querySelector('#VolumeButton img');
    if (volume == 0) {
        volumeIcon.src = volumeMuteHtml; // Мутированный звук
    } else if (volume > 0 && volume <= 0.33) {
        volumeIcon.src = volumeOffHtml; // Тихий звук
    } else if (volume > 0.33 && volume <= 0.66) {
        volumeIcon.src = volumeDownHtml; // Средний звук
    } else if (volume > 0.66) {
        volumeIcon.src = volumeUpHtml; // Громкий звук
    }
}

// Обработчик нажатия клавиш
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyM': // Включение/выключение звука на клавишу "M"
            toggleVolume();
            break;
        default:
            break;
    }
});

//большая кнопка плей
BigPlayPause.addEventListener('click', () => {
    const playIcon = document.querySelector('#BigPlayPause img');
    if (video.paused) {
        video.play();
        BigPlayPause.style.display = 'none'; // Скрыть кнопку при воспроизведении
        playIcon.src = pauseHtml;
        document.querySelector('#PlayPause img').src = pauseHtml;
    } else {
        video.pause();
        BigPlayPause.style.display = 'block'; // Показать кнопку при паузе
    }
});

bigPlayButton.addEventListener('click', function() {
    isBigPlayPressed = true; // Устанавливаем флаг в true после нажатия большой кнопки
    video.play(); // Запускаем видео
});

// Обработчик для нажатия пробела
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Предотвращаем стандартное поведение прокрутки

        if (!isBigPlayPressed) {
            // Если большая кнопка не была нажата, ничего не делаем
            return;
        }

        // Воспроизведение / пауза
        PlayPause();
    }
});

//время и таймлайн
video.addEventListener('loadedmetadata', () => {
    duration.innerText = formatTime(video.duration);
});

video.addEventListener('timeupdate', () => {
    currentTime.innerText = formatTime(video.currentTime);
    const progressPercent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
//управление таймлайном
// Обновление позиции прогресс-бара
function updateProgressBar() {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progress}%`;
}

// Функция для перемещения видео при клике или перетаскивании
function handleTimelineUpdate(e) {
    const timelineWidth = timelineContainer.clientWidth;
    const clickPosition = e.offsetX;
    const newTime = (clickPosition / timelineWidth) * video.duration;
    video.currentTime = newTime;
}
// Обработчик клика по таймлайну
timelineContainer.addEventListener('click', handleTimelineUpdate);
// Обработчики для перетаскивания
timelineContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleTimelineUpdate(e);
});
// Функция для перемещения видео при клике или перетаскивании
timelineContainer.addEventListener('click', handleTimelineUpdate);

// Обработчики для перетаскивания
timelineContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleTimelineUpdate(e);
    e.preventDefault(); // Отключает выделение текста
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const boundingRect = timelineContainer.getBoundingClientRect();
        const clickPosition = e.clientX - boundingRect.left;
        if (clickPosition >= 0 && clickPosition <= timelineContainer.clientWidth) {
            handleTimelineUpdate({ offsetX: clickPosition });
        }
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
//пик ин пик
PiP.addEventListener('click', async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        await video.requestPictureInPicture();
    }
});
//фулскрин
Fullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
            alert(`Error enabling full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
            console.log(`Ошибка при попытке включить полноэкранный режим: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => {
                console.log(`Ошибка при попытке выйти из полноэкранного режима: ${err.message}`);
            });
        }
    }
}
//качество
let currentQuality = '1080p'; // Значение по умолчанию

// Показать или скрыть селектор качества при нажатии на кнопку
qualityButton.addEventListener('click', () => {
    qualityOptions.classList.toggle('show');
});

// Закрыть селектор при выборе опции и поменять качество видео
qualityOptions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        currentQuality = e.target.getAttribute('data-quality');
        changeVideoSource(currentQuality); // Меняем источник видео
        updateQualityButtonText(); // Обновляем текст кнопки
        qualityOptions.classList.remove('show');
    }
}); 

// Закрыть селектор при клике вне области
document.addEventListener('click', (e) => {
    if (!qualityButton.contains(e.target) && !qualityOptions.contains(e.target)) {
        qualityOptions.classList.remove('show');
    }
});

// Функция для обновления текста кнопки
function updateQualityButtonText() {
    qualityButton.textContent = currentQuality; // Устанавливаем текст кнопки только в значение выбранного качества
}

// Функция для смены источника видео
function changeVideoSource(quality) {
    const sources = video.querySelectorAll('source');
    sources.forEach(source => {
        if (source.getAttribute('data-quality') === quality) {
            video.src = source.getAttribute('src'); // Меняем src видео
            video.load(); // Перезагружаем видео
            video.pause(); // Продолжаем воспроизведение
        }
    });
}

// Инициализация - установка начального текста кнопки
updateQualityButtonText();



// Функция для запуска воспроизведения видео
function startPlayback() {
    video.play();
    BigPlayPause.style.display = 'none'; // Скрываем большую кнопку
    buttonContainer.style.display = 'flex';
    timelineContainer.style.display = 'flex'; // Показываем элементы управления
    video.classList.remove('disabled'); // Включаем обработку кликов на видео
}

// Событие нажатия на большую кнопку "Play"
BigPlayPause.addEventListener('click', startPlayback);

// Предотвращаем запуск видео при клике по нему до нажатия на большую кнопку
video.addEventListener('click', (e) => {
    if (video.classList.contains('disabled')) {
        e.preventDefault();
    }
});

// Управление плеером через клавиатуру
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        
        case 'ArrowRight': // Перемотка вперед на 5 секунд
            video.currentTime = Math.min(video.duration, video.currentTime + 5);
            break;
        case 'ArrowLeft': // Перемотка назад на 5 секунд
            video.currentTime = Math.max(0, video.currentTime - 5);
            break;
        case 'ArrowUp': // Увеличение громкости
            video.volume = Math.min(1, video.volume + 0.1);
            volumeSlider.value = video.volume;
            break;
        case 'ArrowDown': // Уменьшение громкости
            video.volume = Math.max(0, video.volume - 0.1);
            volumeSlider.value = video.volume;
            break;
        case 'KeyF': // Полноэкранный режим на клавишу "F"
            toggleFullscreen();
            break;
        
    }
});
//скрыть элементы бездействие
 // Показать элементы управления
 function showControls() {
    control.classList.remove('hidden');
    resetInactivityTimeout(); // Сбрасываем таймер
  }

  // Скрыть элементы управления
  function hideControls() {
    control.classList.add('hidden');
  }
  
  // Обработка движения мыши
  control.addEventListener('mousemove', (e) => {
    isMouseMoving = true;
    showControls(); // Показываем элементы управления при движении мыши
  });

  // Сбрасываем таймер бездействия и начинаем отсчет заново
  function resetInactivityTimeout() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(hideControls, 3000); // Скрываем через 3 секунды
  }

  // Обработка движения мыши внутри плеера
  videoplayer.addEventListener('mousemove', () => {
    isMouseMoving = true;
    showControls(); // Показываем элементы управления при движении мыши внутри плеера
  });

  // Обработка взаимодействий с клавиатурой
  document.addEventListener('keydown', () => {
    showControls(); // Показываем элементы управления при нажатии клавиш
  });

  // Скрываем элементы управления при старте воспроизведения
  video.addEventListener('play', () => {
    resetInactivityTimeout();
  });

  // Показываем элементы управления при паузе
  video.addEventListener('pause', () => {
    showControls(); // Показываем элементы управления на паузе
  });

  // Скрытие элементов при выходе курсора из плеера
  control.addEventListener('mouseleave', resetInactivityTimeout);

  // При наведении на плеер отменяем таймер скрытия
  videopl.addEventListener('mouseenter', () => {
    clearTimeout(inactivityTimeout);
  });

  // Изначально показываем элементы управления
  showControls();

















  
  
  