import { supabase } from './supabase';

// ===== PRODUCTS =====
export const productAPI = {
    async getAll({ category, subcategory, minPrice, maxPrice, sort, search, featured, page = 1, limit = 12 } = {}) {
        let query = supabase.from('products').select('*', { count: 'exact' });

        if (category) query = query.eq('category', category);
        if (subcategory) query = query.eq('subcategory', subcategory);
        if (featured === 'true' || featured === true) query = query.eq('featured', true);
        if (minPrice) query = query.gte('price', Number(minPrice));
        if (maxPrice) query = query.lte('price', Number(maxPrice));
        if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

        if (sort === 'price_asc') query = query.order('price', { ascending: true });
        else if (sort === 'price_desc') query = query.order('price', { ascending: false });
        else query = query.order('created_at', { ascending: false });

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        if (error) throw error;
        return {
            products: data || [],
            total: count || 0,
            page,
            pages: Math.ceil((count || 0) / limit)
        };
    },

    async getOne(id) {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async create(productData) {
        const { data, error } = await supabase.from('products').insert([productData]).select().single();
        if (error) throw error;
        return data;
    },

    async update(id, productData) {
        const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
    },

    async getStats() {
        const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: goldProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', 'gold');
        const { count: silverProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', 'silver');
        const { count: featuredProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true);
        return { totalProducts: totalProducts || 0, goldProducts: goldProducts || 0, silverProducts: silverProducts || 0, featuredProducts: featuredProducts || 0 };
    },

    async uploadImage(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        return urlData.publicUrl;
    }
};

// ===== ENQUIRIES =====
export const enquiryAPI = {
    async create(enquiryData) {
        const { error } = await supabase.from('enquiries').insert([{
            name: enquiryData.name,
            email: enquiryData.email,
            phone: enquiryData.phone,
            message: enquiryData.message,
            product_id: enquiryData.product_id || null
        }]);
        if (error) throw error;
        return { success: true };
    },

    async getAll({ status, page = 1, limit = 20 } = {}) {
        let query = supabase.from('enquiries').select('*, products(name, category, price)', { count: 'exact' });
        if (status) query = query.eq('status', status);
        query = query.order('created_at', { ascending: false });
        const from = (page - 1) * limit;
        query = query.range(from, from + limit - 1);
        const { data, error, count } = await query;
        if (error) throw error;
        return {
            enquiries: data || [],
            total: count || 0,
            page,
            pages: Math.ceil((count || 0) / limit)
        };
    },

    async updateStatus(id, status) {
        const { data, error } = await supabase.from('enquiries').update({ status }).eq('id', id).select('*, products(name, category, price)').single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase.from('enquiries').delete().eq('id', id);
        if (error) throw error;
    },

    async getStats() {
        const { count: total } = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
        const { count: newCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new');
        const { count: readCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'read');
        const { count: repliedCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'replied');
        return { total: total || 0, new: newCount || 0, read: readCount || 0, replied: repliedCount || 0 };
    }
};

// ===== FEEDBACK =====
export const feedbackAPI = {
    async create(feedbackData) {
        const { error } = await supabase.from('feedback').insert([{
            name: feedbackData.name,
            email: feedbackData.email,
            rating: feedbackData.rating,
            message: feedbackData.message,
            user_id: feedbackData.user_id || null
        }]);
        if (error) throw error;
        return { success: true };
    },

    async getAll({ page = 1, limit = 20 } = {}) {
        let query = supabase.from('feedback').select('*', { count: 'exact' });
        query = query.order('created_at', { ascending: false });
        const from = (page - 1) * limit;
        query = query.range(from, from + limit - 1);
        const { data, error, count } = await query;
        if (error) throw error;
        return {
            feedback: data || [],
            total: count || 0,
            page,
            pages: Math.ceil((count || 0) / limit)
        };
    },

    async delete(id) {
        const { error } = await supabase.from('feedback').delete().eq('id', id);
        if (error) throw error;
    },

    async getCount() {
        const { count } = await supabase.from('feedback').select('*', { count: 'exact', head: true });
        return count || 0;
    }
};
