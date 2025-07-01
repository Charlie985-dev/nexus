const GuildAPI = {

async createGuild(formData) {
    return await BaseAPI.post('/api/guild/create', formData, true);
},

async loadGuildMembers(guildID) {
    return await BaseAPI.get(`/api/guild/${guildID}/members?page=1&limit=200`);
},

async fetchUserGuilds() {
    return await BaseAPI.get('/api/user/guilds');
},

async fetchChannelPage(guildID, channelID) {
    return await BaseAPI.get(`/v/${guildID}/${channelID}`);
},

async fetchGuildPage(guildID) {
    return await BaseAPI.get(`/v/${guildID}`);
},

async leaveGuild(guildID) {
    try {
        const response = await BaseAPI.post(`/api/guild/leave/${guildID}`);
            
            if (response.success) {
                const currentPath = window.location.pathname;
                const isViewingThisGuild = currentPath.startsWith(`/v/${guildID}`);
                
                if (isViewingThisGuild) {
                    if (window.channelManager) {
                        window.channelManager.hideChannelsSidebar();
                    }
                    NavigationUtils.redirectToMain();
                } else {
                    if (window.refreshGuildList) {
                        window.refreshGuildList();
                    }
                }
            }
            return response;
        } catch (error) {
            console.error('Failed to leave guild:', error);
            throw error;
        }
    },

async joinGuild(guildID) {
        return await BaseAPI.post(`/api/guild/join/${guildID}`);
    },

    async joinByInvite(inviteCode) {
        return await BaseAPI.post(`/api/invite/join/${inviteCode}`);
    },
async getGuildInfo(guildId) {
    return await BaseAPI.get(`/api/guild/${guildId}/info`);
},

async showGuildInfo(guildId) {
    try {
        const data = await this.getGuildInfo(guildId);
        if (data && window.guildMenuAPI) {
            window.guildMenuAPI.renderButtons('guild-settings-modal', data);
            
            await new Promise(resolve => {
                const checkElements = () => {
                    const nameElement = document.getElementById('guild-info-name');
                    const descElement = document.getElementById('guild-info-description');
                    const idElement = document.getElementById('guild-info-id');
                    
                    if (nameElement && descElement && idElement) {
                        nameElement.textContent = data.name;
                        descElement.textContent = data.description || 'No description set';
                        idElement.textContent = data.guild_id;
                        resolve();
                    } else {
                        setTimeout(checkElements, 10);
                    }
                };
                checkElements();
            });
            
            window.modalManager.openModal('guild-settings-modal');
        }
    } catch (error) {
        console.error('Error showing guild info:', error);
    }
},
    async getChannels(guildID) {
            const response = await fetch(`/api/channels/get?guild_id=${guildID}`);
            return response.json();
        },

async createChannel(formData) {
    return await BaseAPI.post('/api/channels/create', formData, true);
},

async deleteChannel(channelID) {
    return await BaseAPI.post('/api/channels/delete', {channel_id: channelID});
},
async editChannel(channelID, name, description) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    return await BaseAPI.request(`/api/channels/${channelID}/edit`, {
        method: 'PUT',
        body: formData,
        isFormData: true
    });
},
    processTimestamps(container) {
        container.querySelectorAll('p').forEach(paragraph => {
            const text = paragraph.textContent;
            const createdMatch = text.match(/Created:\s*(.+)/);
            if (createdMatch) {
                const timestamp = createdMatch[1].trim();
                paragraph.innerHTML = paragraph.innerHTML.replace(timestamp, formatTimestamp(timestamp, 'date'));
            }
        });
    }
    };

window.GuildAPI = GuildAPI;
window.guildManager = GuildAPI;