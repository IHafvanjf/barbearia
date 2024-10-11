document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const calendarTitle = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const timeSlots = document.getElementById('timeSlots');
    const slotsList = document.getElementById('slotsList');
    const closeTimeSlots = document.getElementById('closeTimeSlots');
    const appointmentModal = document.getElementById('appointmentModal');
    const closeAppointmentModal = document.getElementById('closeAppointmentModal');
    const appointmentForm = document.getElementById('appointmentForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const okConfirmation = document.getElementById('okConfirmation');

    let currentDate = new Date();
    const today = new Date();
    const bookedDates = JSON.parse(localStorage.getItem('bookedDates')) || {};

    const serviceDurations = {
        'Cabelo': 30,
        'Sobrancelha': 10,
        'Barba': 15
    };

    const pusher = new Pusher('c5dc5b55973c301f7482', {
        cluster: 'sa1',
        encrypted: true
    });

    const channel = pusher.subscribe('calendar-channel');
    channel.bind('booking-updated', function(data) {
        bookedDates[data.date] = data.bookings;
        localStorage.setItem('bookedDates', JSON.stringify(bookedDates));
        renderCalendar();
    });

    function renderCalendar() {
        calendar.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        calendarTitle.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const headerRow = document.createElement('div');
        headerRow.classList.add('day-header');
        dayHeaders.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;
            headerRow.appendChild(dayCell);
        });
        calendar.appendChild(headerRow);

        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');
            dayCell.textContent = day;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dayCell.dataset.date = dateStr;

            const cellDate = new Date(year, month, day);

            if (cellDate < today && !(dateStr === '2024-07-31')) {
                dayCell.classList.add('past-day');
            } else if (cellDate.getTime() === today.getTime()) {
                dayCell.classList.add('current-day');
                dayCell.addEventListener('click', () => {
                    showTimeSlots(day, true);
                });
            } else {
                dayCell.addEventListener('click', () => {
                    showTimeSlots(day);
                });
            }

            calendar.appendChild(dayCell);
        }
    }

    function showTimeSlots(day, isToday = false) {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        slotsList.innerHTML = '';

        const dateBookings = bookedDates[dateStr] || {};

        // Definindo horários fixos de 8h até 15h
        for (let hour = 8; hour <= 15; hour++) {
            const slot = `${hour.toString().padStart(2, '0')}:00`;
            const slotItem = document.createElement('li');
            const isBooked = dateBookings[slot] !== undefined;

            if (isBooked) {
                slotItem.innerHTML = `${slot}: <span class="booked-label">OCUPADO</span>`;
                slotItem.classList.add('booked');
            } else if (isToday && (hour < today.getHours())) {
                slotItem.innerHTML = `${slot}: <span class="disabled-label">NÃO DISPONÍVEL</span>`;
                slotItem.classList.add('disabled');
            } else {
                slotItem.textContent = `${slot}: DISPONÍVEL`;
                slotItem.classList.add('available');
                slotItem.addEventListener('click', () => {
                    appointmentModal.style.display = 'block';
                    appointmentForm.dataset.date = dateStr;
                    appointmentForm.dataset.slot = slot;
                });
            }

            slotsList.appendChild(slotItem);
        }

        timeSlots.style.display = 'block';
    }

    function calculateEndTime(startTime, services) {
        let [startHour, startMinute] = startTime.split(':').map(Number);
        let totalMinutes = 0;

        services.forEach(service => {
            totalMinutes += serviceDurations[service] || 0;
        });

        startMinute += totalMinutes;
        if (startMinute >= 60) {
            startHour += Math.floor(startMinute / 60);
            startMinute %= 60;
        }

        return `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    }

    function saveBooking(dateStr, slot, booking) {
        const url = 'http://192.168.1.107:3000/pusher-event';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event: 'booking-updated',
                date: dateStr,
                bookings: {
                    ...bookedDates[dateStr],
                    [slot]: booking
                }
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Evento Pusher enviado com sucesso:', data);
            bookedDates[dateStr] = {
                ...bookedDates[dateStr],
                [slot]: booking
            };
            localStorage.setItem('bookedDates', JSON.stringify(bookedDates));
            renderCalendar();
        })
        .catch(error => {
            console.error('Erro ao enviar evento Pusher:', error);
        });
    }

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }

    function handleWhatsAppMessage(booking) {
        const formattedDate = formatDate(booking.date);
        const message = `Olá, meu nome é ${booking.name}, marquei um serviço de ${booking.services.join(', ')} para o dia ${formattedDate}, no horário de ${booking.slot}.`;
        window.location.href = `https://wa.me/5531987305141?text=${encodeURIComponent(message)}`;
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const dateStr = appointmentForm.dataset.date;
        const slot = appointmentForm.dataset.slot;

        if (!dateStr || !slot) {
            console.error('Data ou horário não encontrados');
            return;
        }

        const nameField = appointmentForm.querySelector('#name');
        const servicesFields = appointmentForm.querySelectorAll('input[name="service"]:checked');
        const services = Array.from(servicesFields).map(field => field.value);

        const booking = {
            name: nameField.value,
            services: services,
            date: dateStr
        };

        saveBooking(dateStr, slot, booking);
        handleWhatsAppMessage(booking);
        appointmentModal.style.display = 'none';
        timeSlots.style.display = 'none';
    }

    function closeModals() {
        appointmentModal.style.display = 'none';
        timeSlots.style.display = 'none';
        confirmationModal.style.display = 'none';
    }

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    closeTimeSlots.addEventListener('click', closeModals);
    closeAppointmentModal.addEventListener('click', closeModals);
    closeConfirmationModal.addEventListener('click', closeModals);
    appointmentForm.addEventListener('submit', handleFormSubmit);

    renderCalendar();
});
