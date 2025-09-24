import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Strings } from '../../theme/Strings';
import { fetchTicketList } from '../../redux/ticketListSlice';
import { getToken } from '../../utils/storage';

const { width } = Dimensions.get('window');

const SupportTicketList = () => {

    const dispatch = useDispatch();
    const API_URL = Strings.APP_BASE_URL || '';
    const [token, setToken] = useState(null);

    const { user } = useSelector(state => state.auth);
    const clientId = user?.id || '';
    useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();
        // console.log("Stored ticket token:", storedToken);
      setToken(storedToken);
    
    };
    loadToken();
  }, []);
    //  Alert.alert('url', JSON.stringify(token));
    useEffect(() => {
    if (!API_URL || !clientId || !token) return;

    // load once immediately
    dispatch(fetchTicketList({ API_URL, user_id: clientId, token }));

    // then refresh every 30 seconds (adjust time as needed)
    const interval = setInterval(() => {
        dispatch(fetchTicketList({ API_URL, user_id: clientId, token }));
    }, 10000);

    // cleanup interval when component unmounts
    return () => clearInterval(interval);
    }, [API_URL, clientId, token, dispatch]);



    // const tickets = [
    //     {
    //         id: "TCK-001",
    //         subject: "Login issue",
    //         status: "Open",
    //         date: "2025-09-05",
    //         description: "Unable to login with my registered email. It keeps saying invalid credentials even though the password is correct.",
    //     },
    //     {
    //         id: "TCK-002",
    //         subject: "Payment not processed",
    //         status: "Pending",
    //         date: "2025-09-04",
    //         description: "I made a payment yesterday, but it has not reflected in my account. Please resolve this urgently.",
    //     },
    //     {
    //         id: "TCK-003",
    //         subject: "Feature request",
    //         status: "Closed",
    //         date: "2025-09-01",
    //         description: "Can you please add dark mode support to the app? It would improve usability at night.",
    //     },
    // ];
 const tickets = useSelector(state => state.ticketList.ticketList || []);
 console.log('tickt',tickets);
    const [expanded, setExpanded] = useState({}); // track expanded tickets

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Open":
                return { backgroundColor: "#dcfce7", color: "#166534" };
            case "Pending":
                return { backgroundColor: "#fef3c7", color: "#92400e" };
            case "Closed":
                return { backgroundColor: "#fecaca", color: "#991b1b" };
            default:
                return { backgroundColor: "#f3f4f6", color: "#374151" };
        }
    };

    const renderItem = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);
        const isExpanded = expanded[item.id];

        return (
            <TouchableOpacity activeOpacity={0.85} style={styles.ticketCard}>
                {/* Header */}
                <View style={styles.ticketHeader}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: item.status_color },
                        ]}
                    >
                        <Text style={[styles.statusText, { color: 'white' }]}>
                            {item.status_name}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <View style={{ marginBottom: 6 }}>
                    <Text
                        numberOfLines={isExpanded ? undefined : 1}
                        style={styles.descriptionText}
                    >
                        {item.description}
                    </Text>
                    <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                        <Text style={styles.seeMoreText}>
                            {isExpanded ? "See less" : "See more"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.ticketFooter}>
                    <View style={styles.footerItem}>
                        {/* <Ionicons name="pricetag-outline" size={14} color="#6b7280" /> */}
                        <Text style={styles.ticketId}>#{item.ticket_number}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        {/* <Ionicons name="calendar-outline" size={14} color="#9ca3af" /> */}
                        <Text style={styles.ticketDate}>
                            {new Date(item.created_at).toISOString().split("T")[0]}
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.title}>Support Tickets</Text> */}
            <FlatList
                data={tickets}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 16,
        color: "#111827",
    },
    ticketCard: {
        backgroundColor: "#ffffff",
        padding: 16,
        marginBottom: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
    },
    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    subjectText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        flex: 1,
        marginRight: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
    seeMoreText: {
        fontSize: 13,
        color: "#2563eb",
        fontWeight: "500",
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
    },
    ticketFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ticketId: {
        fontSize: 14,
        color: "#6b7280",
    },
    ticketDate: {
        fontSize: 13,
        color: "#9ca3af",
    },
});

export default SupportTicketList;