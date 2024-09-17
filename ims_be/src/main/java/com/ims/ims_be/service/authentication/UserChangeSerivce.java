package com.ims.ims_be.service.authentication;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;


@Service
public class UserChangeSerivce {
    private final Map<Integer, Instant> changedUserIds = new ConcurrentHashMap<>();

    public void addChangedUser(Integer userId) {
        changedUserIds.put(userId, Instant.now());
    }

    public boolean hasUserChanged(Integer userId) {
        return changedUserIds.containsKey(userId);
    }

    public void removeChangedUser(Integer userId) {
        changedUserIds.remove(userId);
    }

    @Scheduled(fixedRate = 7200000) // Chạy mỗi 2 giờ
    public void cleanUpOldEntries() {
        Instant now = Instant.now();
        changedUserIds.entrySet().removeIf(entry ->
                now.minusSeconds(1800).isAfter(entry.getValue())); // Xóa nếu đã hơn 30 phút
    }
}
