import React, { useEffect, useState, FC, useRef } from 'react';
import { WebView, WebViewProps } from 'react-native-webview';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../../api/client';
import { useGlobalContext } from '../../GlobalContext';
import { wsClient } from '../../api/wsClient';

interface DynamicAppLoaderProps {
  appId: string;
  gameId: string;
  event?: any; // You might want to define a proper type for event
}

/**
 * Custom error class for app loading errors
 */
class AppLoaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppLoaderError';
  }
}

const WebAppLoader: FC<DynamicAppLoaderProps> = ({ appId, gameId, event }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [webAppPath, setWebAppPath] = useState('');
  const webViewRef = useRef<WebView>(null); // WebView ref for clearing cache
  const [eventId, setEventId] = useState<string | null>(null);

  const { username } = useGlobalContext();

  useEffect(() => {
    loadApp();
  }, [appId]);

  // Add effect to handle event prop
  useEffect(() => {
    if (event?.event_id) {
      setEventId(event.event_id);
    }
  }, [event]);

  // Simple WebSocket message forwarding to WebView
  useEffect(() => {
    if (!eventId) return;

    const setupWebSocket = async () => {
      console.log('Setting up WebSocket #########');
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        // Store the original onMessage handler
        const originalOnMessage = wsClient.onMessage;

        // Override wsClient message handler
        wsClient.onMessage = (event) => {
          // Call original handler
          originalOnMessage(event);

          // Forward message to WebView
          const message = JSON.parse(event.data);
          console.log('Forwarding game-related message to WebView $$$$$$$$$', message);
          if (['PLAYER_JOINED', 'START_GAME', 'PLAY_ACTION'].includes(message.action)) {
            webViewRef.current?.injectJavaScript(`
              window.dispatchEvent(new MessageEvent('message', {
                data: ${JSON.stringify(event.data)}
              }));
            `);
          }
        };

        wsClient.connect(accessToken, appId, eventId);
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    };

    setupWebSocket();

    return () => {
      wsClient.disconnect();
    };
  }, [eventId, appId]);

  const loadApp = async () => {
    try {
      setLoading(true); // Set loading state

      const homeIp = '192.168.31.253';
      const bngIp = '192.168.0.207';
      const parentDirOriginal = `https://d391oeqqigkdbo.cloudfront.net/app-ui/${appId}/index.html`;
     // const parentDirLocal = `http://${bngIp}:8000/0-1/maze/maze-code/frontend/sample-apps/ludo-git/index.html`;
      const parentDirLocal = `http://${bngIp}:8000/0-1/maze/maze-code/frontend/sample-apps/mazegame-git/index.html`;
      const parentDirTemp = `https://maze-social-agent-app.s3.ap-southeast-1.amazonaws.com/app-ui/${appId}/index.html`;
      const parentDirTempGame = `https://maze-social-game-app.s3.ap-southeast-1.amazonaws.com/game-ui/${appId}/index.html`;

      const parentDir = parentDirTempGame;
      console.log('Parent directory >>>>> ', parentDir);
      setWebAppPath(parentDir); // Set the path to the extracted web app

      console.log('webAppPath >>>>> ', webAppPath);
    } catch (err) {
      console.error('Error loading app:', err);
      setError(err instanceof Error ? err : new AppLoaderError('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const onMessageFromWebView = async (event: any) => {
    console.log('onMessageFromWebView #########', event.nativeEvent.data);
    const { action, data } = JSON.parse(event.nativeEvent.data);
    
    switch (action) {
      case 'GET_PLAYERS':
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          const response = await apiClient.get(`/users/${username}/following/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const players = response.data.map(user => ({
            username: user.username,
            name: user.name,
            profileIcon: user.profileIcon
          }));

          const responseData = {
            players: players, 
            currentPlayer: {
              username: username,
              name: null,
              profileIcon: null
            }
          };
          
          webViewRef.current?.injectJavaScript(`
            window.dispatchEvent(new MessageEvent('message', {
              data: JSON.stringify({
                action: 'PLAYERS_RESPONSE',
                data: ${JSON.stringify(responseData)}
              })
            }));
          `);
        } catch (error) {
          console.error('Error fetching players:', error);
        }
        break;

      case 'INVITE_PLAYERS':
        try {
          const accessToken = await AsyncStorage.getItem('accessToken');
          if (!accessToken) {
            throw new Error('No access token found');
          }

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split('T')[0];
          const formattedTime = currentDate.toTimeString().split(' ')[0];
          
          const eventData = {
            title: `${appId}@${username}-${formattedDate}-${formattedTime}`,
            participants: data.players.map(player => player),
            time: currentDate,
            type: 'private',
            username: username,
            game_id: gameId
          };

          const response = await apiClient.post('/events/', eventData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });
          console.log('Response from invite players #########', response.data);
          if (response.data.event_id) {
            setEventId(response.data.event_id);
          }

          webViewRef.current?.injectJavaScript(`
            window.dispatchEvent(new MessageEvent('message', {
              data: JSON.stringify({
                action: 'INVITE_SENT',
                data: {
                  success: true,
                  eventId: response.data.event_id
                }
              })
            }));
          `);
        } catch (error) {
          console.error('Error sending invitation:', error);
          webViewRef.current?.injectJavaScript(`
            window.dispatchEvent(new MessageEvent('message', {
              data: JSON.stringify({
                action: 'INVITE_SENT',
                data: {
                  success: false,
                  error: 'Failed to send invitation'
                }
              })
            }));
          `);
        }
        break;

      case 'PLAYER_JOINED':
      case 'START_GAME':
      case 'PLAY_ACTION':
        // Forward game-related messages to WebSocket
        console.log('Forwarding game-related message to WebSocket #########', event.nativeEvent.data);
        try {
          wsClient.sendMessage({
            action: action,
            data: data
          });
        } catch (error) {
          console.error('Error forwarding message to WebSocket:', error);
        }
        break;

      default:
        console.warn('Unhandled WebView message action:', action);
        break;
    }
  };

  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error.message} />;

  // TODO : NOT WORKING AS OF NOW
  const originWhitelist = [
    'http://*',
    'https://*',
    `file://${webAppPath}/*`
  ];

  // Update the WebView component's onLoad prop
  return (
    <WebView
      ref={webViewRef}
      style={{ flex: 1 }}
      originWhitelist={originWhitelist}
      source={{
        uri: webAppPath,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }}
      onLoad={() => {
        // After WebView loads, send initialization data
        if (webViewRef.current) {
          const initData = {
            action: 'INIT_APP',
            data: {
              isEvent: !!event,
              event,
              appId,
              gameId,
            }
          };

          console.log('initData you get in webview >>>>> ', initData);
          
          // Add a small delay to ensure WebviewBridge is initialized
          setTimeout(() => {
            webViewRef.current?.injectJavaScript(`
              try {
                const initData = ${JSON.stringify(initData)};
                if (window.WebviewBridge && window.WebviewBridge._onMessageFromReactNative) {
                  window.WebviewBridge._onMessageFromReactNative({ 
                    data: JSON.stringify(initData) 
                  });
                }
              } catch (error) {
                console.error('Error in initialization:', error);
              }
              true;
            `);
          }, 500); // Small delay to ensure bridge is ready
        }
      }}
      javaScriptEnabled={true}
      cacheEnabled={false}
      cacheMode={'LOAD_NO_CACHE'}
      domStorageEnabled={false}
      allowFileAccess={false}
      allowUniversalAccessFromFileURLs={false}
      onMessage={onMessageFromWebView}
      injectedJavaScript={`
        (function() {
          window.onerror = function(message, source, lineno, colno, error) {
            const errorMsg = {
              message: message,
              source: source,
              lineno: lineno,
              colno: colno,
              error: error ? error.stack : null,
              warning: warning ? warning.stack : null
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(errorMsg));
            return false; // prevent the default browser error handling
          };
        })();
      `}
    />
  );
};

const LoadingView: FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Loading game...</Text>
  </View>
);

/**
 * ErrorView component
 * Displays an error message
 */
const ErrorView: FC<{ error: string }> = ({ error }) => (
  <View style={styles.container}>
    <Text>Error: {error}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

export default WebAppLoader;
