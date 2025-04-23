import React, { useState, forwardRef, useImperativeHandle } from 'react';

const countries = [
    { name: 'Pakistan', code: 'PK' },
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
];

const ShippingForm = forwardRef(({ onSubmit, initialValues, onFormChange }, ref) => {
    const [shippingInfo, setShippingInfo] = useState(initialValues || {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        countryCode: '',
        phone: '',
        email: ''
    });

    const [errors, setErrors] = useState({});

    // Expose validate function to parent via ref
    useImperativeHandle(ref, () => ({
        validate: () => {
            const isValid = validateForm();
            return isValid;
        },
        getValues: () => shippingInfo
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Notify parent about form changes
        if (onFormChange) {
            onFormChange({ ...shippingInfo, [name]: value });
        }
    };

    const handleCountryChange = (e) => {
        const selectedCountry = countries.find(c => c.code === e.target.value);
        const updatedInfo = {
            ...shippingInfo,
            country: selectedCountry?.code || '',
            countryCode: selectedCountry?.code || ''
        };
        setShippingInfo(updatedInfo);
        if (onFormChange) {
            onFormChange(updatedInfo);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!shippingInfo.name.trim()) newErrors.name = 'Name is required';
        if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
        if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
        if (!shippingInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!shippingInfo.country) newErrors.country = 'Country is required';
        if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
        if (!shippingInfo.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid && onSubmit) {
            onSubmit(shippingInfo);
        }
    };

    // Updated glass effect styles with subtle off-white/light gray tones
    const glassInputStyle = {
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(240, 240, 240, 0.15)',
        border: '1px solid rgba(200, 200, 200, 0.2)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        color: '#333',
    };

    const glassFocusStyle = {
        backgroundColor: 'rgba(245, 245, 245, 0.25)',
        borderColor: 'rgba(180, 180, 180, 0.4)',
        outline: 'none',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    };

    const glassHoverStyle = {
        backgroundColor: 'rgba(235, 235, 235, 0.2)'
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Shipping Information</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={shippingInfo.name}
                        onChange={handleChange}
                        style={glassInputStyle}
                        className={`w-full p-3 rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                        required
                        onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                        onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleChange}
                        style={glassInputStyle}
                        className={`w-full p-3 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                        required
                        onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                        onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    style={glassInputStyle}
                    className={`w-full p-3 rounded-lg ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="Enter your street address"
                    required
                    onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                    onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        style={glassInputStyle}
                        className={`w-full p-3 rounded-lg ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Enter your city"
                        required
                        onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                        onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleChange}
                        style={glassInputStyle}
                        className={`w-full p-3 rounded-lg ${errors.postalCode ? 'border-red-500' : ''}`}
                        placeholder="Enter postal code"
                        required
                        onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                        onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleCountryChange}
                    style={glassInputStyle}
                    className={`w-full p-3 rounded-lg ${errors.country ? 'border-red-500' : ''}`}
                    required
                    onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                    onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                        <option key={country.code} value={country.code}>
                            {country.code}
                        </option>
                    ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    style={glassInputStyle}
                    className={`w-full p-3 rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter your phone number"
                    required
                    onFocus={(e) => Object.assign(e.target.style, glassFocusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, glassInputStyle)}
                    onMouseEnter={(e) => Object.assign(e.target.style, glassHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, glassInputStyle)}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
        </form>
    );
});

export default ShippingForm;