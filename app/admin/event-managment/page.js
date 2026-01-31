'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/adminSidebar';
import AdminHeader from '@/components/adminHeader';
import eventService from '@/lib/services/eventService';
import { useToast } from '@/hooks/use-toast';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function EventManagement() {
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('events'); // 'events', 'occasions', 'inquiries'
    const [view, setView] = useState('list'); // 'list', 'create', 'edit'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [occasions, setOccasions] = useState([]);
    const [occasionView, setOccasionView] = useState('list'); // 'list', 'create'

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        location: '',
        occasion: '',
        date: '',
        time: '',
        includes: [],
        images: [],
    });

    const [formOccasionData, setFormOccasionData] = useState({
        occasion: '',
        images: [],
    });

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getAllEvents();
            const events = Array.isArray(response) ? response : response.data || [];
            setEvents(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast({ title: 'Error', description: 'Failed to load events', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEventInquiries();
            setInquiries(Array.isArray(data) ? data : data.inquiries || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOccasions = async () => {
        try {
            setLoading(true);
            const data = await eventService.getAllOccasions();
            setOccasions(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Error fetching occasions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOccasionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('occasion', formOccasionData.occasion);
        if (formOccasionData.images && formOccasionData.images.length > 0) {
            formOccasionData.images.forEach((file) => {
                data.append('images', file);
            });
        }

        try {
            await eventService.createOccasion(data);
            toast({ title: 'Success', description: 'Occasion created successfully' });
            setOccasionView('list');
            fetchOccasions();
            setFormOccasionData({ occasion: '', images: [] });
        } catch (error) {
            console.error('Error creating occasion:', error);
            toast({ title: 'Error', description: 'Failed to create occasion', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'events') {
            fetchEvents();
        } else if (activeTab === 'occasions') {
            fetchOccasions();
        } else {
            fetchInquiries();
        }
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setFormData(prev => ({ ...prev, images: Array.from(files) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddInclude = () => {
        setFormData(prev => ({ ...prev, includes: [...prev.includes, ''] }));
    };

    const handleRemoveInclude = (index) => {
        setFormData(prev => ({
            ...prev,
            includes: prev.includes.filter((_, i) => i !== index)
        }));
    };

    const handleIncludeChange = (index, value) => {
        const updatedIncludes = [...formData.includes];
        updatedIncludes[index] = value;
        setFormData(prev => ({ ...prev, includes: updatedIncludes }));
    };

    const handleOccasionInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setFormOccasionData(prev => ({ ...prev, images: Array.from(files) }));
        } else {
            setFormOccasionData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('originalPrice', formData.originalPrice);
        data.append('location', formData.location);
        data.append('occasion', formData.occasion);
        data.append('date', formData.date);
        data.append('time', formData.time);
        
        // Append includes as JSON array
        if (formData.includes && formData.includes.length > 0) {
            data.append('includes', JSON.stringify(formData.includes.filter(inc => inc.trim())));
        }
        
        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((file) => {
                data.append('images', file);
            });
        }

        try {
            if (view === 'create') {
                await eventService.createEvent(data);
                toast({ title: 'Success', description: 'Event created successfully' });
            } else if (view === 'edit' && selectedEvent) {
                await eventService.updateEvent(selectedEvent._id, data);
                toast({ title: 'Success', description: 'Event updated successfully' });
            }
            setView('list');
            fetchEvents();
            setFormData({
                title: '',
                description: '',
                price: '',
                originalPrice: '',
                location: '',
                occasion: '',
                date: '',
                time: '',
                includes: [],
                images: [],
            });
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error saving event:', error);
            alert('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            price: event.price,
            originalPrice: event.originalPrice || '',
            location: event.location,
            occasion: event.occasion,
            date: event.date || '',
            time: event.time || '',
            includes: event.includes || [],
            images: [], // Don't prepopulate file input
        });
        setView('edit');
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(id);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    // Render Functions
    const renderEventList = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Events List</h2>
                <button
                    onClick={() => setView('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Add New Event
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasion</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Includes</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                            <tr key={event._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {event.images && event.images.length > 0 && (
                                        <img src={event.images[0]} alt={event.title} className="h-10 w-10 rounded-full object-cover" />
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{event.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="font-semibold">₹{event.price}</div>
                                    {event.originalPrice && event.originalPrice > event.price && (
                                        <div className="text-xs text-gray-400 line-through">₹{event.originalPrice}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.occasion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {event.includes && event.includes.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {event.includes.slice(0, 2).map((include, idx) => (
                                                <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {include}
                                                </span>
                                            ))}
                                            {event.includes.length > 2 && (
                                                <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                                                    +{event.includes.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No events found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderForm = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">{view === 'create' ? 'Create New Event' : 'Edit Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Original Price (₹)</label>
                        <input
                            type="number"
                            name="originalPrice"
                            value={formData.originalPrice}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Occasion</label>
                        <input
                            type="text"
                            name="occasion"
                            value={formData.occasion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Includes (Features/Items)</label>
                        <button
                            type="button"
                            onClick={handleAddInclude}
                            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                            + Add Item
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.includes.map((include, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={include}
                                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                                    placeholder={`Item ${index + 1}`}
                                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInclude(index)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {formData.includes.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No items added yet. Click "+ Add Item" to add features.</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Event Images</label>
                    <input
                        type="file"
                        name="images"
                        onChange={handleInputChange}
                        className="mt-1 block w-full"
                        accept="image/*"
                        multiple
                    />
                    {view === 'edit' && selectedEvent?.images?.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-2">Current Images:</p>
                            <div className="flex gap-2 flex-wrap">
                                {selectedEvent.images.map((img, idx) => (
                                    <div key={idx} className="h-20 w-20 relative">
                                        <img src={img} alt={`Event ${idx + 1}`} className="h-full w-full object-cover rounded border" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setView('list')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading ? 'Saving...' : 'Save Event'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderInquiries = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Event Inquiries</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inquiries.map((inquiry, idx) => (
                            <tr key={inquiry._id || idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(inquiry.createdAt || Date.now()).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inquiry.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{inquiry.email}</div>
                                    <div>{inquiry.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {inquiry.eventId ? inquiry.eventId.title || inquiry.eventId : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>Loc: {inquiry.location}</div>
                                    <div>Date: {inquiry.partyDate}</div>
                                </td>
                            </tr>
                        ))}
                        {inquiries.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No inquiries found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderOccasionList = () => (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Occasions List</h2>
                <button
                    onClick={() => setOccasionView('create')}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                    Add New Occasion
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasion Name</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {occasions.map((occ, idx) => (
                            <tr key={occ._id || idx}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {occ.images && occ.images.length > 0 && (
                                        <img src={occ.images[0]} alt={occ.occasion} className="h-10 w-10 rounded-full object-cover" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{occ.occasion}</td>
                            </tr>
                        ))}
                        {occasions.length === 0 && (
                            <tr>
                                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No occasions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderOccasionForm = () => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Create New Occasion</h2>
            <form onSubmit={handleOccasionSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Occasion Name</label>
                    <input
                        type="text"
                        name="occasion"
                        value={formOccasionData.occasion}
                        onChange={handleOccasionInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Occasion Image</label>
                    <input
                        type="file"
                        name="images"
                        onChange={handleOccasionInputChange}
                        className="mt-1 block w-full"
                        accept="image/*"
                        multiple
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setOccasionView('list')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
                    >
                        {loading ? 'Saving...' : 'Save Occasion'}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col lg:ml-0">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-y-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="max-w-7xl mx-auto space-y-6"
                    >
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => { setActiveTab('events'); setView('list'); }}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                Manage Events
                            </button>
                            <button
                                onClick={() => { setActiveTab('occasions'); setOccasionView('list'); }}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'occasions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                Manage Occasions
                            </button>
                            <button
                                onClick={() => setActiveTab('inquiries')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'inquiries' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                Inquiries
                            </button>
                        </div>

                        {activeTab === 'events' && (
                            <>
                                {view === 'list' && renderEventList()}
                                {(view === 'create' || view === 'edit') && renderForm()}
                            </>
                        )}

                        {activeTab === 'occasions' && (
                            <>
                                {occasionView === 'list' && renderOccasionList()}
                                {occasionView === 'create' && renderOccasionForm()}
                            </>
                        )}

                        {activeTab === 'inquiries' && renderInquiries()}

                    </motion.div>
                </main>
            </div>
        </div>
    );
}
